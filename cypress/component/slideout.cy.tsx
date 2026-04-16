import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { mount } from "../support/mount";

describe("Slideout Panel", () => {
  beforeEach(() => {
    mount(<DashboardPage />);
  });

  it("opens when a system card is clicked", () => {
    cy.get("[data-cy=system-card]").first().click();
    cy.get("[data-cy=slideout-panel]").should("be.visible");
  });

  it("displays the correct system name in the title", () => {
    cy.get("[data-cy=system-card]").first().then(($card) => {
      const name = $card.find("h3").text();
      cy.wrap($card).click();
      cy.get("[data-cy=slideout-title]").should("have.text", name);
    });
  });

  it("shows the system description in the detail view", () => {
    cy.get("[data-cy=system-card]").first().click();
    cy.get("[data-cy=slideout-panel]").within(() => {
      cy.get("p").should("have.length.greaterThan", 0);
    });
  });

  it("closes when the close button is clicked", () => {
    cy.get("[data-cy=system-card]").first().click();
    cy.get("[data-cy=slideout-panel]").should("be.visible");
    cy.get("[data-cy=slideout-close]").click();
    cy.get("[data-cy=slideout-panel]").should("not.exist");
  });

  it("also opens from list view rows", () => {
    cy.get("[data-cy=view-mode-list]").click();
    cy.get("[data-cy=system-row]").first().click();
    cy.get("[data-cy=slideout-panel]").should("be.visible");
  });
});
