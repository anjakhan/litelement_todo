import { LitElement, html } from 'lit-element';
<<<<<<< HEAD
import { connect } from 'pwa-helpers';
import { store } from '../redux/store';
import { VisibilityFilters, getVisibleTodoSelector } from '../redux/reducer';

import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-checkbox';
import '@vaadin/vaadin-radio-button/vaadin-radio-button';
import '@vaadin/vaadin-radio-button/vaadin-radio-group';
=======

import { VisibilityFilters, getVisibleTodoSelector } from '../redux/reducer';
import { connect } from 'pwa-helpers';
import { store } from '../redux/store';
>>>>>>> eb978daee5678a1c889fafde689b1e1c2657fe97

import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-checkbox';
import '@vaadin/vaadin-radio-button/vaadin-radio-button';
import '@vaadin/vaadin-radio-button/vaadin-radio-group';

import {
    addTodo,
    updateTodoStatus,
    updateFilter,
    clearCompleted
} from '../redux/action.js';

class TodoView extends connect(store)(LitElement) {
    static get properties() {
        return {
            todos: { type: Array },
            filter: { type: String },
            task: { type: String }
        }
    }

    stateChanged(state) {
        this.todos = getVisibleTodoSelector(state);
        this.filter = state.filter;
    }

    render() {
        return html`
            <style>
                todo-view { 
                    display: block;
                    max-width: 800px;
                    margin: 0 auto;
                }
                todo-view .input-layout {
                    width: 100%;
                    display: flex;
                }
                todo-view .input-layout vaadin-text-field {
                    flex: 1;
                    margin-right: var(--spacing); 
                }
                todo-view .todos-list {
                    margin-top: var(--spacing);
                }
                todo-view .visibility-filters {
                    margin-top: calc(4 * var(--spacing));
                }
            </style>

            <div class="input-layout" @keyup="${this.shortcutListener}">
                <vaadin-text-field 
                    placeholder="Task"
                    value="${this.task || ''}"
                    @change="${this.updateTask}"
                ></vaadin-text-field>
                <vaadin-button
                    theme="primary"
                    @click="${this.addTodo}"
                >Add todo<vaadin-button>
            </div>

            <div class="todos-list">
                ${this.todos.map(todo => html`
                    <div class="todo-item">
                        <vaadin-checkbox
                            ?checked="${todo.complete}" 
                            @change="${ e => this.updateTodoStatus(todo, e.target.checked)}"> 
                            ${todo.task}
                        </vaadin-checkbox>
                    </div>
                `)}
            </div>

            <vaadin-radio-group
                class="visibility-filters"
                value="${this.filter}"
                @value-changed="${this.filterChanged}"> 

                ${Object.values(VisibilityFilters).map(filter => html`
                    <vaadin-radio-button value="${filter}">
                        ${filter}
                    </vaadin-radio-button>`
                )}
            </vaadin-radio-group>
            <vaadin-button @click="${this.clearCompleted}">
                Clear completed
            </vaadin-button>
        `;
    }

    addTodo() {
        if(this.task) {
            store.dispatch(addTodo(this.task));
            this.task = '';
        }
    }

    shortcutListener(e) {
        if (e.key === 'Enter') {
            this.addTodo();
        }
    }

    updateTask(e) {
        this.task = e.target.value.trim();
    }

    updateTodoStatus(updatedTodo, complete) {
        store.dispatch(updateTodoStatus(updatedTodo, complete));
    }

    filterChanged(e) { 
        store.dispatch(updateFilter(e.detail.value));
    }

    clearCompleted() { 
        store.dispatch(clearCompleted());
    }

    createRenderRoot() {
        return this;
    }
}

customElements.define('todo-view', TodoView);