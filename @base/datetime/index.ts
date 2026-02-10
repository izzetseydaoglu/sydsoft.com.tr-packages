/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-10 20:23:07
 */

export default class dateTime {
    private datetime: Date | string;
    private resut_format: string = "y-m-d h:i:s";

    constructor(datetime: Date | string | null = null, format: string = "y-m-d h:i:s") {
        this.format(format);
        this.datetime = datetime !== "0000-00-00 00:00:00" && datetime !== "0000-00-00" && datetime ? datetime : new Date().toISOString(); // GMT ekli halde
        return this;
    }

    public addDays(days: number) {
        const datetime = new Date(this.datetime);
        datetime.setDate(datetime.getDate() + days);
        this.datetime = datetime.toISOString();
        return this;
    }

    private parse() {
        const datetime = new Date(this.datetime);
        const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
        const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
        return {
            y: datetime.getFullYear().toString(),
            m: (datetime.getMonth() + 1).toString().padStart(2, "0"),
            d: datetime.getDate().toString().padStart(2, "0"),
            h: datetime.getHours().toString().padStart(2, "0"),
            i: datetime.getMinutes().toString().padStart(2, "0"),
            s: datetime.getSeconds().toString().padStart(2, "0"),
            ms: (datetime.getMilliseconds() / 10).toFixed(0).toString().padStart(2, "0"),
            z: (datetime.getTimezoneOffset() / 60).toString(),
            // TAM STRING ICEREN IFADELER SONA EKLENMELI
            TAMAY: monthNames[datetime.getMonth()],
            TAMGUN: dayNames[datetime.getDay()]
        };
    }

    public getResult() {
        const parse: any = this.parse();
        let result = this.resut_format;
        result = result.replace(new RegExp("y", "g"), parse.y.toString());
        result = result.replace(new RegExp("m", "g"), parse.m.toString());
        result = result.replace(new RegExp("d", "g"), parse.d.toString());
        result = result.replace(new RegExp("h", "g"), parse.h.toString());
        result = result.replace(new RegExp("i", "g"), parse.i.toString());
        result = result.replace(new RegExp("s", "g"), parse.s.toString());
        result = result.replace(new RegExp("ms", "g"), parse.ms.toString());
        result = result.replace(new RegExp("z", "g"), parse.z.toString());
        result = result.replace(new RegExp("TAMAY", "g"), parse.TAMAY.toString());
        result = result.replace(new RegExp("TAMGUN", "g"), parse.TAMGUN.toString());
        return result;
    }

    public format(format: string = "y-m-d h:i:s") {
        this.resut_format = format;
        return this;
    }

    public today() {
        this.datetime = new Date().toISOString();
        this.format("y-m-d");
        return this.getResult();
    }

    public getTime() {
        const convertDateTime = new dateTime(this.datetime).format("y-m-d h:i:s").getResult();
        const datetime = new Date(convertDateTime);
        return datetime.getTime();
    }

    public nextMonthFirstDay(format = "y-m-d") {
        // Verilen tarihin bir sonraki ayının ilk gününü bul
        this.datetime = new Date(this.datetime);
        this.datetime.setMonth(this.datetime.getMonth() + 1);
        this.datetime.setDate(1);
        this.datetime = this.datetime.toISOString();
        this.format(format);
        return this.getResult();
    }
}
