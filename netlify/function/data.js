const defaultState = () => ({
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
  user: { name: 'Administrateur', role: 'Administrateur', initial: 'A' },
  remuneration: {
    1: { percentage: 0, bonus: 0 },
    2: { percentage: 5, bonus: 0 },
    3: { percentage: 5, bonus: 0 },
    4: { percentage: 5, bonus: 0 }
  }
});

const getSharedStore = () => {
  try {
    const { getStore } = require('@netlify/blobs');
    const options = { name: 'steinway-data' };
    if (process.env.NETLIFY_SITE_ID && process.env.NETLIFY_TOKEN) {
      options.siteID = process.env.NETLIFY_SITE_ID;
      options.token = process.env.NETLIFY_TOKEN;
    }
    return getStore(options);
  } catch (error) {
    console.warn('Netlify Blobs non configuré:', error.message);
    return null;
  }
};

const store = getSharedStore();

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
    if (!store) {
      return sendJson({
        error: 'Netlify Blobs non configuré. Ajoutez NETLIFY_SITE_ID et NETLIFY_TOKEN dans Netlify.',
        sharedMode: 'disabled'
      }, 503);
    }

    if (event.httpMethod === 'GET') {
      const data = await store.get('state');
      return sendJson(data ? JSON.parse(data) : defaultState());
    }

    if (event.httpMethod === 'POST') {
      const payload = JSON.parse(event.body || '{}');
      await store.set('state', JSON.stringify(payload));
      return sendJson({ ok: true, saved: true, shared: true });
    }

    return sendJson({ error: 'Method not allowed' }, 405);
  } catch (error) {
    return sendJson({ error: error.message, sharedMode: 'error' }, 500);
  }
};
