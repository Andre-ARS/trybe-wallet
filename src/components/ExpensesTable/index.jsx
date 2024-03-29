import React, { Component } from 'react';
import PropTypes, { object } from 'prop-types';
import { BsTrashFill } from 'react-icons/bs';
import { FaEdit } from 'react-icons/fa';
import { connect } from 'react-redux';
import { deleteExpense, editorMode } from '../../actions';
import './style.css';

const TABLE_HEADERS = [
  'Descrição',
  'Tag',
  'Método de pagamento',
  'Valor',
  'Moeda',
  'Câmbio utilizado',
  'Valor convertido',
  'Moeda de conversão',
  'Editar/Excluir'];
class ExpensesTable extends Component {
  handleEditorMode = (editorId) => {
    const { expenses, editMode } = this.props;
    const editorExpense = expenses
      .filter(({ id }) => id === editorId);
    editMode(editorId, editorExpense);
  }

  renderTableHeader = () => TABLE_HEADERS
    .map((header) => <th key={ header }>{ header }</th>);

  renderTableBody = () => {
    const { expenses, delExpense } = this.props;

    const tbody = expenses
      .map(({ value, currency, method, tag, description, exchangeRates, id }) => {
        const { ask, name } = exchangeRates[currency];

        return (
          <tr key={ id }>
            <td>{ description }</td>
            <td>{ tag }</td>
            <td>{ method }</td>
            <td>{ parseFloat(value).toFixed(2) }</td>
            <td>{ name.split() }</td>
            <td>{ parseFloat(ask).toFixed(2) }</td>
            <td>{ (ask * value).toFixed(2) }</td>
            <td>Real</td>
            <td>
              <button
                type="button"
                data-testid="edit-btn"
                onClick={ () => this.handleEditorMode(id) }
                className="edit"
              >
                <FaEdit />
              </button>
              <button
                type="button"
                data-testid="delete-btn"
                onClick={ () => delExpense(id) }
                className="delet"
              >
                <BsTrashFill />
              </button>
            </td>
          </tr>
        );
      });

    return tbody;
  }

  render() {
    return (
      <div className="table-container">
        <table cellSpacing="0" cellPadding="0">
          <thead>
            <tr key="">
              { this.renderTableHeader() }
            </tr>
          </thead>
          <tbody>
            { this.renderTableBody() }
          </tbody>
        </table>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  delExpense: (id) => dispatch(deleteExpense(id)),
  editMode: (id, expense) => dispatch(editorMode(id, expense)),
});

ExpensesTable.propTypes = {
  expenses: PropTypes.arrayOf(object),
}.isRequired;

export default connect(null, mapDispatchToProps)(ExpensesTable);
