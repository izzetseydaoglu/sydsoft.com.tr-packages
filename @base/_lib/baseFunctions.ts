export const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export function tumuBuyukCevir(e: React.ChangeEvent<HTMLInputElement>) {
    if (e?.target && e?.target?.setSelectionRange) {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        e.target.value = e.target.value.toString().toLocaleUpperCase("tr");
        e.target.setSelectionRange(start, end);
    }
}

export function tumuKucukCevir(e: React.ChangeEvent<HTMLInputElement>) {
    if (e?.target && e?.target?.setSelectionRange) {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        e.target.value = e.target.value.toString().toLocaleLowerCase("tr");
        e.target.setSelectionRange(start, end);
    }
}

export function seoCevirFunction(e: React.ChangeEvent<HTMLInputElement>) {
    if (e?.target && e?.target?.setSelectionRange) {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        let string = e.target.value.toString().toLocaleLowerCase("tr");
        let turkce = [" ", "-", "ş", "Ş", "ı", "ü", "Ü", "ö", "Ö", "ç", "Ç", "ş", "Ş", "ı", "ğ", "Ğ", "İ", "ö", "Ö", "Ç", "ç", "ü", "Ü", "â", "ê", "Â", "“", "”"];
        let duzgun = ["-", "-", "s", "S", "i", "u", "U", "o", "O", "c", "C", "s", "S", "i", "g", "G", "I", "o", "O", "C", "c", "u", "U", "a", "ê", "a", "", ""];
        for (let i = 0; i < turkce.length; i++) {
            string = string.split(turkce[i]).join(duzgun[i]);
        }
        string = string.replace(/[^a-z0-9\-_şıüğçİŞĞÜÇ]+/gi, "_");
        string = string.replace(/_+/g, "_");
        string = string.replace(/^-/, "_");
        string = string.replace(/-$/, "_");

        e.target.value = string;
        e.target.setSelectionRange(start, end);
    }
}
