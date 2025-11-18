const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    key: '20034d5f5c06592f4e2914c582d19a57',
    'content-type': 'application/json'
  }
};

fetch('https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost', options) .then(res => res.json())
.then(res => console.log(res)) .catch(err => console.error(err));
