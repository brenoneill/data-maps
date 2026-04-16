import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { mount } from "../support/mount";

describe("FilterBar", () => {
  beforeEach(() => {
    mount(<DashboardPage />);
  });

  describe("expand / collapse", () => {
    it("hides the filter panel when collapse is clicked", () => {
      cy.get("[data-cy=filter-panel]").should("be.visible");
      cy.get("[data-cy=toggle-filters]").click();
      cy.get("[data-cy=filter-panel]").should("not.be.visible");
    });

    it("re-expands the filter panel when expand is clicked", () => {
      cy.get("[data-cy=toggle-filters]").click();
      cy.get("[data-cy=filter-panel]").should("not.be.visible");
      cy.get("[data-cy=toggle-filters]").click();
      cy.get("[data-cy=filter-panel]").should("be.visible");
    });

    it("shows a collapsed summary when filters are active and panel is collapsed", () => {
      cy.get("[data-cy=filter-checkbox]").first().click();
      cy.get("[data-cy=toggle-filters]").click();
      cy.get("[data-cy=collapsed-filter-summary]").should("be.visible");
    });
  });

  describe("group-by select", () => {
    it("updates the URL when group-by is changed", () => {
      cy.get("[data-cy=group-by-select]").click();
      cy.get("[role=option]").contains("Data Use").click();
      cy.location("search").should("include", "groupBy=dataUse");
    });

    it("re-renders swimlane headers for the new grouping", () => {
      cy.get("[data-cy=group-by-select]").click();
      cy.get("[role=option]").contains("Data Use").click();
      cy.get("[data-cy=swimlane]").should("have.length.greaterThan", 0);
    });
  });

  describe("checkbox filters", () => {
    it("adds a system type filter to the URL", () => {
      cy.get("[data-cy=filter-checkbox]").contains("Application").click();
      cy.location("search").should("include", "st=Application");
    });

    it("adds a data use filter to the URL", () => {
      cy.get("[data-cy=filter-checkbox]")
        .contains("Third Party Advertising")
        .click();
      cy.location("search").should("include", "du=advertising.third_party");
    });

    it("adds a data categories filter to the URL", () => {
      cy.get("[data-cy=filter-checkbox]").contains("Cookie ID").click();
      cy.location("search").should(
        "include",
        "dc=user.derived.identifiable.device.cookie_id"
      );
    });

    it("supports multiple selections as comma-separated URL params", () => {
      cy.get("[data-cy=filter-checkbox]").contains("Application").click();
      cy.get("[data-cy=filter-checkbox]").contains("Service").click();
      cy.location("search").should("include", "st=Application,Service");
    });
  });

  describe("clear filters", () => {
    it("removes all filter URL params", () => {
      cy.get("[data-cy=filter-checkbox]").contains("Application").click();
      cy.location("search").should("include", "st=");
      cy.get("[data-cy=clear-filters]").click();
      cy.location("search").should("not.include", "st=");
    });
  });

  describe("filter mode toggle", () => {
    it("shows checkbox filters by default", () => {
      cy.get("[data-cy=filter-checkbox]").should("exist");
    });

    it("switches to sentence filter mode", () => {
      cy.get("[data-cy=filter-mode-sentence]").click();
      cy.get("[data-cy=filter-panel]").should("contain.text", "Show me all");
    });

    it("switches back to checkbox filter mode", () => {
      cy.get("[data-cy=filter-mode-sentence]").click();
      cy.get("[data-cy=filter-mode-checkbox]").click();
      cy.get("[data-cy=filter-checkbox]").should("exist");
    });
  });
});
