// Utilitaires simplifiés pour la gestion des Ariary

export const formatAriary = (amount) => {
    const num = parseFloat(amount || 0);
    if (isNaN(num)) return '0 Ar';
    return `${num.toLocaleString('fr-FR')} Ar`;
};

export const formatAmountForTable = (amount) => {
    const num = parseFloat(amount || 0);
    if (isNaN(num)) return '0 Ar';

    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)} M Ar`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(0)} K Ar`;
    }
    return formatAriary(num);
};

export const convertEurosToAriary = (euros, rate = 4500) => {
    return Math.round(parseFloat(euros || 0) * rate);
};

export default {
    formatAriary,
    formatAmountForTable,
    convertEurosToAriary
};