import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { mount } from "../support/mount";

describe("View Mode Toggle", () => {
  beforeEach(() => {
    mount(<DashboardPage />);
  });

  it("shows the board view by default", () => {
    cy.get("[data-cy=swimlane-board]").should("exist");
    cy.get("[data-cy=list-view]").should("not.exist");
  });

  it("switches to list view", () => {
    cy.get("[data-cy=view-mode-list]").click();
    cy.get("[data-cy=list-view]").should("exist");
    cy.get("[data-cy=swimlane-board]").should("not.exist");
  });

  it("switches back to board view", () => {
    cy.get("[data-cy=view-mode-list]").click();
    cy.get("[data-cy=view-mode-board]").click();
    cy.get("[data-cy=swimlane-board]").should("exist");
    cy.get("[data-cy=list-view]").should("not.exist");
  });

  it("shows system rows in list view", () => {
    cy.get("[data-cy=view-mode-list]").click();
    cy.get("[data-cy=system-row]").should("have.length.greaterThan", 0);
  });

  it("shows system cards in board view", () => {
    cy.get("[data-cy=system-card]").should("have.length.greaterThan", 0);
  });
});
