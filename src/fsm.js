class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this._initial = config.states[config.initial];
        this._states = config.states;
        this._history = ["normal"];
        this._historyBuffer = [];
        this._lastStep = 1;
        this._couldBeRedone = false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        for(let stateName of Object.keys(this._states)){
            if(this._states[stateName] == this._initial){
                return stateName;
            }
        }
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(Object.keys(this._states).includes(state)){
            this._initial = this._states[state];
            this._history.push(this.getState());
            this._lastStep++;
            this._couldBeRedone = false;
        }
        else{
            throw new Error();
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        for(let possibleEvent of Object.keys(this._initial.transitions)){
            if(possibleEvent == event){
                this.changeState(this._initial.transitions[event]);
                this._couldBeRedone = false;
                return;
            }
        }
        throw new Error();
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState("normal");
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event = "") {
        if(event){
            let arr = [];
            for(let stateName of Object.keys(this._states)){
                if(Object.keys(this._states[stateName].transitions).includes(event)){
                    arr.push(stateName);
                }
            }
            return arr;
        }
        else{
            return Object.keys(this._states);
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this._history.length > 1){
            let undone = this._history.pop();
            this._historyBuffer.push(undone);
            this._initial = this._states[this._history[this._history.length - 1]];
            this._lastStep--;
            this._couldBeRedone = true;
            return true;
        }
        else{
            return false;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this._historyBuffer.length && this._couldBeRedone){
            let redone = this._historyBuffer.pop();
            this._history.push(redone);
            this._initial = this._states[this._history[this._history.length - 1]];
            this._lastStep++;
            return true;
        }
        else{
            return false;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._history = [];
        this._historyBuffer = [];
        this._lastStep = 0;
        this._couldBeRedone = false;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
