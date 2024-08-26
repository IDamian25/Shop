class AnalizeProduseVanzari 
{
    constructor() {
        this.actiuni = [];
        this.topuri = [];
    }

    adaugaActiune(actiune) 
    {
        this.actiuni.push(actiune);
    }

    agregeazaDate() 
    {
        const dateAgregate = {};

        this.actiuni.forEach(actiune => {
            const data = new Date(actiune.timp);
            const saptamana = this.obtineSaptamana(data);
            const luna = data.getMonth() + 1;
            const an = data.getFullYear();

            const perioade = [
                { tip: 'saptamanal', id: `${saptamana}.${an}` },
                { tip: 'lunar', id: `${luna}.${an}` },
                { tip: 'anual', id: `${an}` }
            ];

            perioade.forEach(perioada => {
                const cheie = `${actiune.tip}_${perioada.tip}_${perioada.id}`;
                if (!dateAgregate[cheie]) {
                    dateAgregate[cheie] = {};
                }
                if (!dateAgregate[cheie][actiune.prod]) {
                    dateAgregate[cheie][actiune.prod] = 0;
                }
                dateAgregate[cheie][actiune.prod] += parseInt(actiune.valoare);
            });
        });

        this.topuri = [];
        for (const [cheie, date] of Object.entries(dateAgregate)) {
            const [tip_element, tip_top, ident_top] = cheie.split('_');
            const produseSortate = Object.entries(date)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 100);

            produseSortate.forEach(([prod, sumaValori], index) => {
                this.topuri.push({
                    tip_element,
                    tip_top,
                    ident_top,
                    linie: index + 1,
                    sumaValori,
                    prod: parseInt(prod)
                });
            });
        }
    }

    obtineSaptamana(d)
     {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const inceputAn = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - inceputAn) / 86400000) + 1) / 7);
    }

    afiseazaTopuri() {
        const topuriGrupate = {};
        this.topuri.forEach(top => {
            const cheie = `${top.tip_element}_${top.tip_top}_${top.ident_top}`;
            if (!topuriGrupate[cheie]) {
                topuriGrupate[cheie] = [];
            }
            topuriGrupate[cheie].push(top);
        });

        for (const [cheie, topuri] of Object.entries(topuriGrupate)) {
            const [tip_element, tip_top, ident_top] = cheie.split('_');
            console.log(`Top ${tip_top} de ${tip_element} pentru ${ident_top}`);
            topuri.forEach(top => {
                const evolutie = this.obtineEvolutie(top);
                console.log(`${top.linie}. Produsul #${top.prod} - ${evolutie}`);
            });
            console.log('-------------------');
        }
    }

    obtineEvolutie(top) 
    {
        
        const evolutii = ['în creștere', 'în scădere', 'stagnare'];
        return evolutii[Math.floor(Math.random() * evolutii.length)];
    }
}


const analize = new AnalizeProduseVanzari();

analize.adaugaActiune(
    {
    id: 1,
    tip: 'vanzare',
    valoare: '10',
    timp: '2024-08-01 12:12:23',
    prod: 123
}
);

analize.adaugaActiune({
    id: 2,
    tip: 'apreciere',
    valoare: '2',
    timp: '2024-08-10 12:12:23',
    prod: 123
});


analize.agregeazaDate();

analize.afiseazaTopuri();