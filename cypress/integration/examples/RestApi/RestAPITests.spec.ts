
/// <reference types="cypress" />


describe('REST API Suite', () =>{    
      
context('Rest API on pokeapi.co/api/v2/pokemon', () =>{

    it('Get Call Invoke',() => {
        cy.request('GET','/api/v2/pokemon').then(response =>
        {      
            cy.log(response.status.toString())
            expect(response.status).to.eq(200)
            expect(response.body.results[0]).to.have.property('url')
            cy.log(response.body.results[0].name)
            cy.log(JSON.stringify(response.body))
        })
    })

    it('Query Json Respnose using LINQ Filters', () => {
        cy.request('GET','/api/v2/pokemon').then(response => 
        {
            cy.log("Printing all Results ==>");
            response.body.results.forEach(e => cy.log(e));
            cy.log("PRINTING DETAILS FOR CHARIZAD ==>");
            response.body.results.filter(f => f.name === 'charizard').forEach(e => cy.log(e));
            cy.log("PRINTING DETAILS FOR NAMES STARTING WITH 'b'  ==>");
            response.body.results.filter(n => n.name.startsWith("b")).forEach(e => cy.log(e))        
        });
    })  
    
    it('Query url for name squirtle', () => 
    {         
        cy.request('GET','/api/v2/pokemon').then(response => 
        {
            var url = response.body.results.filter(f => f.name === 'squirtle')[0].url;
            cy.log("Url for Squirtel : "+ JSON.stringify(url));
            cy.request('GET',url).then((response) => 
            {
                cy.log("Printing all Abilities Results ==>");
                response.body.abilities.forEach(e => cy.log(e.ability));
                var url2 = response.body.game_indices.filter(a => a.version.name === 'white-2')[0].version.url;
                cy.log("Url for white-2 : "+ JSON.stringify(url2));
            })
        })        
    })
})

// Tests for Jsonplaceholder API
context('Rest API on jsonplaceholder.typicode.com', () => 
{
    before('set base url', () => 
    {
        Cypress.config('baseUrl', 'https://jsonplaceholder.typicode.com');
        cy.log('base url set to : https://jsonplaceholder.typicode.com');
    })

    it('POST on jsonplaceholder', () => 
    {
       // read file 
       cy.readFile('cypress/integration/examples/RestApi/RequestJSONs/PlaceholderPostRequest.json').then(jsonObj =>
       {
           // parse json to modify values
           cy.log('json file contents before modification: '+ JSON.stringify(jsonObj));            
           jsonObj.title = 'Rupam';
           jsonObj.body = 'Body of Json File';
           jsonObj.userId = 404;
           cy.log('json file contents after modification: '+ JSON.stringify(jsonObj)); 

           // invoke Post and evaluate response
           cy.request('POST', '/posts', JSON.stringify(jsonObj)).then(response =>
           {
               cy.log('response status :' + response.status);
               expect(response.status).to.eq(201);
               //cy.log('response body: ' + JSON.stringify((<any>response)));
               cy.log('response statusText : ' + response.statusText);
           }) 
       })
    })

    it('GET on jsonplaceholder', () => 
    {
        // invoke get and evaluate response
        cy.request('GET','/posts/1').then(response =>
        {
            cy.log('response status :' + response.status);
            expect(response.status).to.eq(200);
            expect(response.body.id).to.eq(1);
            cy.log('response statusText : ' + response.statusText);
        }) 
    })  

    it('Placeolder PUT - Update User', () =>{
        cy.readFile('cypress/integration/examples/RestApi/RequestJSONs/PlaceholderPostRequest.json').then((contents) =>{
            contents.title = 'testTitle';
            contents.body = 'testBody';
            contents.userId = 201;
            // First Create the User to be updated
            cy.request({
                method: 'POST',
                url: '/posts',
                headers: {
                  'Content-Type' : 'text/json'
                },
                body : JSON.stringify(contents)
            }).then(postResponse =>{
                expect(postResponse.status).to.eq(201);
                expect(postResponse.body.id).to.eq(101);
                cy.log("POST response: " + JSON.stringify(postResponse.body));

                // Update the user now from the response object.
                cy.request({
                    method : 'PUT',
                    url : '/posts/1',
                    headers : {
                        'Content-Type' : 'text/json'
                    },
                    body : postResponse.body
                }).then(putResponse => {
                    expect(putResponse.status).to.be.eq(200);
                    cy.log("PUT response: " + JSON.stringify(putResponse.body));
                })
            })
        })
    })

})

})