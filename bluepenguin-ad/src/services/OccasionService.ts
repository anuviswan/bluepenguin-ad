export interface Occasion {
    name: string;
    date: Date;
    type: 'Festival' | 'Public Holiday' | 'Special Day';
}

export class OccasionService {
    private static occasions: Occasion[] = [
        { name: 'Mannam Jayanti', date: new Date('2026-01-02'), type: 'Public Holiday' },
        { name: 'Republic Day', date: new Date('2026-01-26'), type: 'Public Holiday' },
        { name: 'Maha Shivaratri', date: new Date('2026-02-15'), type: 'Festival' },
        { name: 'Eid-ul-Fitr (Ramzan)', date: new Date('2026-03-20'), type: 'Festival' },
        { name: 'Maundy Thursday', date: new Date('2026-04-02'), type: 'Special Day' },
        { name: 'Good Friday', date: new Date('2026-04-03'), type: 'Public Holiday' },
        { name: 'Vishu', date: new Date('2026-04-15'), type: 'Festival' },
        { name: 'May Day', date: new Date('2026-05-01'), type: 'Public Holiday' },
        { name: 'Bakrid (Eid-ul-Adha)', date: new Date('2026-05-27'), type: 'Festival' },
        { name: 'Muharram', date: new Date('2026-06-25'), type: 'Festival' },
        { name: 'Independence Day', date: new Date('2026-08-15'), type: 'Public Holiday' },
        { name: 'Thiruvonam (Onam)', date: new Date('2026-08-26'), type: 'Festival' },
        { name: 'Sree Narayana Guru Samadhi', date: new Date('2026-09-21'), type: 'Public Holiday' },
        { name: 'Gandhi Jayanthi', date: new Date('2026-10-02'), type: 'Public Holiday' },
        { name: 'Deepavali', date: new Date('2026-11-08'), type: 'Festival' },
        { name: 'Christmas', date: new Date('2026-12-25'), type: 'Festival' }
    ];

    static getUpcoming(limit: number = 2): Occasion[] {
        const today = new Date();
        // Reset time to start of day for accurate comparison
        today.setHours(0, 0, 0, 0);

        return this.occasions
            .filter(o => o.date >= today)
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, limit);
    }
}
