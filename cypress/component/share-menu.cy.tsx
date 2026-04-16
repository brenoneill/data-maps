import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { mount } from "../support/mount";

describe("ShareMenu", () => {
  beforeEach(() => {
    mount(<DashboardPage />);
  });

  it("opens the menu when Share is clicked", () => {
    cy.get("[data-cy=share-button]").click();
    cy.get("[data-cy=share-menu]").should("be.visible");
  });

  it("closes the menu on Escape", () => {
    cy.get("[data-cy=share-button]").click();
    cy.get("[data-cy=share-menu]").should("be.visible");
    cy.get("body").type("{esc}");
    cy.get("[data-cy=share-menu]").should("not.exist");
  });

  it("copies the current URL to clipboard", () => {
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, "writeText").resolves();

      cy.get("[data-cy=share-button]").click();
      cy.get("[data-cy=copy-link]").click();

      cy.wrap(win.navigator.clipboard.writeText).should(
        "have.been.calledOnce"
      );
      cy.wrap(win.navigator.clipboard.writeText).should(
        "have.been.calledWithMatch",
        /https?:\/\//
      );
    });
  });

  it("copies a summary message to clipboard", () => {
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, "writeText").resolves();

      cy.get("[data-cy=share-button]").click();
      cy.get("[data-cy=copy-summary]").click();

      cy.wrap(win.navigator.clipboard.writeText).should(
        "have.been.calledOnce"
      );
      cy.wrap(win.navigator.clipboard.writeText).should(
        "have.been.calledWithMatch",
        /systems/
      );
    });
  });

  it("shows a success alert after copying", () => {
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, "writeText").resolves();

      cy.get("[data-cy=share-button]").click();
      cy.get("[data-cy=copy-link]").click();
      cy.contains("copied to clipboard").should("be.visible");
    });
  });
});
