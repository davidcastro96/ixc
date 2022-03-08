import fetch from 'node-fetch';

const url = "http://imaginecx--tst2.custhelp.com/services/rest/connect/v1.3/contacts"
const username = 'ICXCandidate';
const password = 'Welcome2021';

fetch(url,{ method :'GET',
            headers: {'Authorization': 'Basic ' + btoa(username + ":" + password)}})
  .then((res1) => {
    return res1.json()
  }).then((res2) => {
    console.log(res2)
  })