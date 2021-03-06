import {
  DEL_EXPENSE,
  EDITOR_MODE,
  EDIT_EXPENSE,
  GET_CURRENCIES,
  GET_TOTAL,
  STORE_EXPENSE } from '../actions';

const INITIAL_STATE = {
  currencies: [],
  expenses: [],
  total: 0,
  editorMode: false,
  editorId: '',
  editorExpense: {},
};

const sumTotal = (expenses) => {
  let total = 0;
  expenses.forEach(({ exchangeRates, currency, value }) => {
    const { ask } = exchangeRates[currency];
    const mult = ask * value;
    total += mult;
  });
  return total.toFixed(2);
};

const editExpense = (actionState, { expenses, editorId }) => {
  const editedExpenses = expenses.map((expen) => {
    if (expen.id === editorId) {
      return {
        ...expen,
        ...actionState,
        id: editorId,
      };
    }
    return expen;
  });
  return editedExpenses;
};

const wallet = (state = INITIAL_STATE,
  { type, acronym, expense, actionId, editorExpense, actionState }) => {
  switch (type) {
  case GET_CURRENCIES:
    return {
      ...state,
      currencies: acronym,
    };
  case STORE_EXPENSE:
    return {
      ...state,
      expenses: [...state.expenses, expense],
      total: sumTotal([...state.expenses, expense]),
    };
  case DEL_EXPENSE:
    return {
      ...state,
      expenses: state.expenses
        .filter(({ id }) => id !== actionId),
      total: sumTotal(state.expenses
        .filter(({ id }) => id !== actionId)),
    };
  case GET_TOTAL:
    return {
      ...state,
      total: sumTotal(state.expenses),
    };
  case EDITOR_MODE:
    return {
      ...state,
      editorMode: true,
      editorId: actionId,
      editorExpense: editorExpense[0],
    };
  case EDIT_EXPENSE:
    return {
      ...state,
      expenses: editExpense(actionState, state),
      total: sumTotal(editExpense(actionState, state)),
      editorMode: false,
      editorId: '',
      editorExpense: {},
    };
  default:
    return state;
  }
};

export default wallet;
