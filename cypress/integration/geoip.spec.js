describe("check geoip", () => {
    it("check 104.17.215.67 for api, expect get status: failed", () => {
        cy.request(
            "POST",
            "api/geoip",
            JSON.stringify({ ips: ["104.17.215.67"] })
        ).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property("status", "failed");
        });
    });

    it("check 184.87.69.19 for api, expect get status: succeeded", () => {
        cy.request(
            "POST",
            "api/geoip",
            JSON.stringify({ ips: ["184.87.69.19"] })
        ).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property("status", "succeeded");
        });
    });

    it("check textarea submit with 184.87.69.19, expect get cityName: Newark", () => {
        cy.visit("/");
        cy.get("#demo_ips").type("184.87.69.19");
        cy.get("#demo_submit").click();
        cy.get("td:nth-child(3)").should("have.text", "Newark");
    });

    it("check textarea submit with 184.87.69.19,69.163.160.97, expect get cityName: Newark and Brea", () => {
        cy.visit("/");
        cy.get("#demo_ips").type("184.87.69.19{enter}69.163.160.97");
        cy.get("#demo_submit").click();
        cy.get("tr:nth-child(1) > td:nth-child(3)").should(
            "have.text",
            "Newark"
        );
        cy.get("tr:nth-child(2) > td:nth-child(3)").should("have.text", "Brea");
    });
});
