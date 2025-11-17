import db from '$lib/db';

export class FacultyController {
    static async getCicluri() {
        try {
            const [cicluri] = await db.query('SELECT id, denumire FROM ciclu_studii');

            return {
            status: 'success',
            data: {
                cicluri_studii: cicluri
            },
            code: 200
            };

        } catch (error: any) {
            return {
            status: 'failed',
            error: 'A apărut o eroare la preluarea datelor',
            details: error.message,
            code: 500
            };
        }
    },
    static async getFacultati() {

        const [facultati] = await db.query('SELECT id, denumire FROM facultati');

        return {
            status: 'success',
            data: {     
                facultati: facultati
            },
            code: 200
            };

        } catch (error: any) {
            return {
            status: 'failed',
            error: 'A apărut o eroare la preluarea datelor',
            details: error.message,
            code: 500
            };
        }

    }
}


