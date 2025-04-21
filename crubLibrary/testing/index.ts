import crublibrary from 'crublibrarydhruv';

const crud = new crublibrary({ apiKey: 'c1c73ffa-a5f8-4e51-80ec-55275d218246', apiUrl: 'http://localhost:3000/api' });
crud.recharge()
  .then((msg) => console.log(msg))
  .catch((e) => {
    if (e.response) {
      // When the error is coming from the server (status code 403)
      console.log("Error from server:", e.response.data.error);
    } else {
      console.log("Error testing:", e.message);
    }
  });
