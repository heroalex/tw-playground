import { expect, test, describe } from "bun:test";
import app from "./server";

test("2 + 2", () => {
    expect(2 + 2).toBe(4);
});

describe('Example', () => {
    test('GET /', async () => {
        const res = await app.request('/')
        expect(res.status).toBe(200)
        expect(await res.text()).toContain('Welcome!')
    })
})