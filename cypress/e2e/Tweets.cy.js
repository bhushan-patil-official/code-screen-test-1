describe ('App loads successfully', () => {
  it ('Visit the app', () => {
    cy.visit ('/');
  });
});

describe ('Tests for joe_smith', () => {
  it ('Data renders correctly for joe_smith', () => {
    cy.visit ('/');
    cy.get ('[id="input-box"]').type ("joe_smith").should ('have.value', "joe_smith");
    cy.get ('[id="input-form"]').submit();
    cy.get ('[id="most-popular-hashtag"]').should('have.text', 'worldcup2018');
    cy.get ('[id="most-tweets"]').should('have.text', '10');
    cy.get ('[id="longest-tweet-id"]').should('have.text', '0c2dc9');
    cy.get ('[id="most-days"]').should('have.text', '120');
  });
});
