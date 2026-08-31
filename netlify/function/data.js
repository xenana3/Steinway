const { getStore } = require('@netlify/blobs');

const store = getStore({ name: 'steinway-data' });

const sendJson = (body, statusCode = 200) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  },
  body: JSON.stringify(body)
});

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return sendJson({ ok: true }, 200);
  }

  try {
    if (event.httpMethod === 'GET') {
      const data = await store.get('state');
      return sendJson(data ? JSON.parse(data) : {
        products: [
          { id: 1, name: 'Bière pression', price: 500, icon: '🍺', stock: 1, active: true },
          { id: 2, name: 'Cidre', price: 600, icon: '🍏', stock: 1, active: true },
          { id: 3, name: 'Jus de raisin', price: 200, icon: '🍇', stock: 1, active: true },
          { id: 4, name: 'Piña Colada', price: 600, icon: '🍹', stock: 1, active: true },
          { id: 5, name: 'Old Fashioned', price: 600, icon: '🥃', stock: 1, active: true },
          { id: 6, name: 'Bourbon', price: 800, icon: '🥃', stock: 1, active: true },
          { id: 7, name: 'Whisky', price: 800, icon: '🥃', stock: 1, active: true },
          { id: 8, name: 'Champagne', price: 2000, icon: '🍾', stock: 1, active: true }
        ],
        users: [
          { id: 1, name: 'Administrateur', role: 'Administrateur', pin: '1234', initial: 'A' },
          { id: 2, name: 'Manon Lefèvre', role: 'Barmaid', pin: '2468', initial: 'M' },
          { id: 3, name: 'Harry Snake', role: 'Barman', pin: '8642', initial: 'H' },
          { id: 4, name: 'Raven', role: 'Barman', pin: '8642', initial: 'R' }
        ],
        orders: [],
        days: [],
        cart: {},
        activeView: 'sale',
        payment: 'Espèces',
        dayOpen: true,
        user: { name: 'Administrateur', role: 'Administrateur', initial: 'A' }
      });
    }

    if (event.httpMethod === 'POST') {
      const payload = JSON.parse(event.body || '{}');
      await store.set('state', JSON.stringify(payload));
      return sendJson({ ok: true, saved: true });
    }

    return sendJson({ error: 'Method not allowed' }, 405);
  } catch (error) {
    return sendJson({ error: error.message }, 500);
  }
};
