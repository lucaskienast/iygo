const request = require('supertest');
const {
    getAllCards,
    createCard,
    getCard,
    updateCard,
    deleteCard,
    updateCardImages,
    countCardsAndImages
} = require('./controllers/cardsController');

describe("GET /api/v1/cards", () => {

    describe("get cards without search filters", () => {

        test("response should include 10 number of hits", async () => {
            const response = await request("localhost:3000").get("/api/v1/cards");
            const jsonResponse = JSON.parse(response.text);
            expect(jsonResponse.nbHits).toBe(10);
        });

        test("response should include array of length 10", async () => {
            const response = await request("localhost:3000").get("/api/v1/cards");
            const jsonResponse = JSON.parse(response.text);
            expect(jsonResponse.cards.length).toBe(10);
        });

        test("should respond with a 200 status code", async () => {
            const response = await request("localhost:3000").get("/api/v1/cards");
            expect(response.statusCode).toBe(200);
        });

        test("should specify json in the content header", async () => {
            const response = await request("localhost:3000").get("/api/v1/cards");
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
        });
    });

    describe("get cards with search filters", () => {

        test("response should include specified number of hits or maximum possible", async () => {
            const response = await request("localhost:3000").get("/api/v1/cards?limit=20");
            const jsonResponse = JSON.parse(response.text);
            expect(jsonResponse.nbHits).toBeGreaterThan(10);
        });

        test("response should include only specified card type", async () => {
            const response = await request("localhost:3000").get("/api/v1/cards?type=Effect Monster");
            const jsonResponse = JSON.parse(response.text);
            let allCardsAreEffectMonsters = true;
            jsonResponse.cards.map((card) => {
                if (card.type != "Effect Monster") {
                    allCardsAreEffectMonsters = false;
                }
            });
            expect(allCardsAreEffectMonsters).toEqual(true);
        });

        test("response should include only specified card race", async () => {
            const response = await request("localhost:3000").get("/api/v1/cards?race=Equip");
            const jsonResponse = JSON.parse(response.text);
            let allCardsAreEquipCards = true;
            jsonResponse.cards.map((card) => {
                if (card.race != "Equip") {
                    allCardsAreEquipCards = false;
                }
            });
            expect(allCardsAreEquipCards).toEqual(true);
        });

        test("response should include only specified card attribute", async () => {
            const response = await request("localhost:3000").get("/api/v1/cards?attribute=DARK");
            const jsonResponse = JSON.parse(response.text);
            let allCardsAreDarkCards = true;
            jsonResponse.cards.map((card) => {
                if (card.attribute != "DARK") {
                    allCardsAreDarkCards = false;
                }
            });
            expect(allCardsAreDarkCards).toEqual(true);
        });

        test("response should include only specified card attack", async () => {
            const response = await request("localhost:3000").get("/api/v1/cards?numericFilters=atk-$gte-1900");
            const jsonResponse = JSON.parse(response.text);
            let allCardsAtLeast1900Atk = true;
            jsonResponse.cards.map((card) => {
                if (Number(card.atk) < 1900) {
                    allCardsAtLeast1900Atk = false;
                }
            });
            expect(allCardsAtLeast1900Atk).toEqual(true);
        });

        test("response should include only specified card defense", async () => {
            const response = await request("localhost:3000").get("/api/v1/cards?numericFilters=def-$lte-1100");
            const jsonResponse = JSON.parse(response.text);
            let allCardsAtMost1100Def = true;
            jsonResponse.cards.map((card) => {
                if (Number(card.def) > 1100) {
                    allCardsAtMost1100Def = false;
                }
            });
            expect(allCardsAtMost1100Def).toBe(true);
        });

        test("response should include only specified card level", async () => {
            const response = await request("localhost:3000").get("/api/v1/cards?numericFilters=level-$lte-4");
            const jsonResponse = JSON.parse(response.text);
            let allCardsAtMostLevel4 = true;
            jsonResponse.cards.map((card) => {
                if (Number(card.level) > 4) {
                    allCardsAtMostLevel4 = false;
                }
            });
            expect(allCardsAtMostLevel4).toBe(true);
        });

        test("response should include only specified card fields", async () => {
            const response = await request("localhost:3000").get("/api/v1/cards?fields=name,type,level");
            const jsonResponse = JSON.parse(response.text);
            let allCardsOnly3SameFields = true;
            jsonResponse.cards.map((card) => {
                if (Object.getOwnPropertyNames(card).includes("card_id")) {
                    allCardsOnly3SameFields = false;
                }
            });
            expect(allCardsOnly3SameFields).toBe(true);
        });

        // extend test cases to all possible filters
    });
});