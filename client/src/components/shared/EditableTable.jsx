import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, Edit, Save, X } from 'lucide-react';

const EditableTable = ({
    data,
    columns,
    onUpdate,
    onAdd,
    onDelete,
    keyField = 'id',
    pagination = true,
    pageSize = 10
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Filtrage et tri des données
    const filteredAndSortedData = useMemo(() => {
        let filtered = data.filter(item =>
            columns.some(col =>
                String(item[col.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [data, searchTerm, sortConfig]);

    // Pagination
    const paginatedData = useMemo(() => {
        if (!pagination) return filteredAndSortedData;

        const startIndex = (currentPage - 1) * pageSize;
        return filteredAndSortedData.slice(startIndex, startIndex + pageSize);
    }, [filteredAndSortedData, currentPage, pageSize, pagination]);

    const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const startEdit = (item) => {
        setEditingId(item[keyField]);
        setEditData({ ...item });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    const saveEdit = async () => {
        try {
            await onUpdate(editingId, editData);
            setEditingId(null);
            setEditData({});
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
        }
    };

    const handleEditChange = (key, value) => {
        setEditData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleAdd = async () => {
        const newItem = columns.reduce((acc, col) => {
            acc[col.key] = col.defaultValue || '';
            return acc;
        }, {});

        try {
            await onAdd(newItem);
        } catch (error) {
            console.error('Erreur lors de l\'ajout:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg">
            {/* En-tête avec recherche et bouton d'ajout */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + Ajouter
                </button>
            </div>

            {/* Tableau */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort(column.key)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.label}</span>
                                        {sortConfig.key === column.key && (
                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((item) => (
                            <tr key={item[keyField]} className="hover:bg-gray-50">
                                {columns.map((column) => (
                                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {editingId === item[keyField] ? (
                                            column.editable !== false ? (
                                                <input
                                                    type={column.type || 'text'}
                                                    value={editData[column.key] || ''}
                                                    onChange={(e) => handleEditChange(column.key, e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            ) : (
                                                item[column.key]
                                            )
                                        ) : (
                                            column.render ? column.render(item[column.key], item) : item[column.key]
                                        )}
                                    </td>
                                ))}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {editingId === item[keyField] ? (
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={saveEdit}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                <Save className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => startEdit(item)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(item[keyField])}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Supprimer
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Affichage de {((currentPage - 1) * pageSize) + 1} à {Math.min(currentPage * pageSize, filteredAndSortedData.length)} sur {filteredAndSortedData.length} éléments
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <span className="text-sm text-gray-700">
                            Page {currentPage} sur {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditableTable;