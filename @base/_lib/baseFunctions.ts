export const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
export const isServerReq = (context: any) => !context?.req?.url?.startsWith('/_next');
export const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

export const padNumber = (num: number, padLength = 2, padString = '0') => String(num).padStart(padLength, padString);

export function inputTumuBuyukCevir(e: React.ChangeEvent<HTMLInputElement>) {
    if (e?.target && e?.target?.setSelectionRange) {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        e.target.value = e.target.value.toString().toLocaleUpperCase('tr-TR');
        e.target.setSelectionRange(start, end);
    }
}

export function inputTumuKucukCevir(e: React.ChangeEvent<HTMLInputElement>) {
    if (e?.target && e?.target?.setSelectionRange) {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        e.target.value = e.target.value.toString().toLocaleLowerCase('tr-TR');
        e.target.setSelectionRange(start, end);
    }
}

export const convertLowerCase = (text: any = '') => text.toString().toLocaleLowerCase('tr-TR');

export const convertForSearch = (value: string) => {
    let data = value?.toString().toLocaleLowerCase('tr-TR');
    data = data.replace(/ö/g, 'o');
    data = data.replace(/ç/g, 'c');
    data = data.replace(/ş/g, 's');
    data = data.replace(/ı/g, 'i');
    data = data.replace(/ğ/g, 'g');
    data = data.replace(/ü/g, 'u');
    data = data.replace(/[^a-z\d]/g, ''); // %_- are allowed
    data = data.replace(/^\s+|\s+$/g, '');
    return data;
};

export function convertForSEO(e: React.ChangeEvent<HTMLInputElement>) {
    if (e?.target && e?.target?.setSelectionRange) {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        let string = e.target.value.toString().toLocaleLowerCase('tr');
        const turkce = [' ', '-', 'ş', 'Ş', 'ı', 'ü', 'Ü', 'ö', 'Ö', 'ç', 'Ç', 'ş', 'Ş', 'ı', 'ğ', 'Ğ', 'İ', 'ö', 'Ö', 'Ç', 'ç', 'ü', 'Ü', 'â', 'ê', 'Â', '“', '”'];
        const duzgun = ['-', '-', 's', 'S', 'i', 'u', 'U', 'o', 'O', 'c', 'C', 's', 'S', 'i', 'g', 'G', 'I', 'o', 'O', 'C', 'c', 'u', 'U', 'a', 'ê', 'a', '', ''];
        for (let i = 0; i < turkce.length; i++) {
            string = string.split(turkce[i]).join(duzgun[i]);
        }
        string = string.replace(/[^a-z0-9\-_şıüğçİŞĞÜÇ]+/gi, '_');
        string = string.replace(/_+/g, '_');
        string = string.replace(/^-/, '_');
        string = string.replace(/-$/, '_');

        e.target.value = string;
        e.target.setSelectionRange(start, end);
    }
}

export function getDomain(context: any = null) {
    let url = '';
    if (context) {
        url = context.req.headers.host;
    } else if (typeof window !== 'undefined') {
        url = window.location.hostname;
    }

    if (url.length) {
        const parts = url.split('.').reverse();
        const cnt = parts.length;
        if (cnt >= 3) {
            // see if the second level domain is a common SLD.
            if (parts[1].match(/^(com|edu|gov|net|mil|org|nom|co|name|info|biz)$/i)) {
                const domain = parts[2] + '.' + parts[1] + '.' + parts[0];
                return domain.split(':')[0];
            }
        }
        const domain = parts[1] + '.' + parts[0];
        return domain.split(':')[0];
    }
    return url;
}

export const uniqueID = (key = '', length = 16) => {
    return (
        key +
        parseInt(
            Math.ceil(Math.random() * Date.now())
                .toPrecision(length)
                .toString()
                .replace('.', '')
        )
    );
};
