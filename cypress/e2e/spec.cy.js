describe("open project", () => {
  it("Test: h1 contains Hacker Escape Rooms", () => {
    cy.visit("/index.html")
    cy.get("h1").should("contain", "Hacker Escape Rooms")
  })
})

describe("open project", () => {
  it("Test when everything pass", () => {
    cy.visit("/index.html")
    cy.contains("Play on-site").click()
    cy.contains("Book this room").click()

    const date = new Date();
    date.setDate(date.getDate() + 1);
    const bookingDate = date.toISOString().split("T")[0];

    cy.get("#booking-date").type(bookingDate)
    cy.contains("Search available times").click()

    cy.get("#name").type("Test")
    cy.get("#email").type("test123@gmail.com")
    cy.contains("Submit booking").click({ force: true })

    cy.get(".modal-title").should("contain", "Thank you!")
  })
})

describe("open project", () => {
  it("Test: invalid date. Step 1", () => {
    cy.visit("/index.html")
    cy.contains("Play on-site").click()
    cy.contains("Book this room").click()
    cy.contains("Search available times").click()
    cy.on("window:alert", (alert) => {
      expect(alert).to.equal("Please select a valid future date.")
    })
  })
})

describe("open project", () => {
  it("Test: Missing inputfields. Step 2", () => {
    cy.visit("/index.html")
    cy.contains("Play on-site").click()
    cy.contains("Book this room").click()
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const bookingDate = date.toISOString().split("T")[0];

    cy.get("#booking-date").type(bookingDate)
    cy.contains("Search available times").click()
    cy.contains("Submit booking").click({ force: true })
    cy.on("window:alert", (alert) => {
      expect(alert).to.equal("Please fill in all fields.")
    })
  })
})

describe("open project", () => {
  it("Test: Invalid email adress. Step 2", () => {
    cy.visit("/index.html")
    cy.contains("Play on-site").click()
    cy.contains("Book this room").click()
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const bookingDate = date.toISOString().split("T")[0];

    cy.get("#booking-date").type(bookingDate)
    cy.contains("Search available times").click()
    cy.get("#name").type("Test")
    cy.get("#email").type("Test123")
    cy.contains("Submit booking").click({ force: true })
    cy.on("window:alert", (alert) => {
      expect(alert).to.equal("You must enter a valid email address")
    })
  })
})