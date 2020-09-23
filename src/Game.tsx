import React from 'react';
import CSS from 'csstype';

interface GameProps {
    cards: string[]
}

interface GameState {
    deck: string[][],
    prev?: GameState
}

export class Game extends React.Component<GameProps, GameState> {
    
    constructor(props: GameProps) {
        super(props);
        this.state = {
            deck: [[], Object.assign([], props.cards)]
        }
    }

    drawCard = (card: string) => {
        const prevState = this.copyState(this.state);
        if (!this.removeFromArr(this.state.deck[1], card)) return;
        if (this.state.deck[1].length === 0) { this.state.deck.splice(1, 1); }
        this.state.deck[0].push(card);
        this.setState({
            deck: this.state.deck,
            prev: prevState
        });
    }

    drawEpidemicCard = (card: string) => {
        const prevState = this.copyState(this.state);
        if (!this.removeFromArr(this.state.deck[this.state.deck.length - 1], card)) 
            return;
        if (this.state.deck[this.state.deck.length - 1].length === 0)
            this.state.deck.splice(this.state.deck.length - 1, 1);
        this.state.deck[0].push(card);
        this.state.deck.unshift([]);
        this.setState({
            deck: this.state.deck,
            prev: prevState
        });
    }

    removeCard = (card: string) => {
        const prevState = this.copyState(this.state);
        if (!this.removeFromArr(this.state.deck[0], card))
            return;
        this.setState({
            deck: this.state.deck,
            prev: prevState
        });
    }

    undo = () => {
        this.setState(this.state.prev as GameState);
    }
    
    render() {
        return (
            <div>
                <div className="game">
                    <div className="left-container">
                        {
                            this.props.cards
                                .filter((c, i) => { return this.props.cards.indexOf(c) === i; })
                                .sort((a, b) => this.getDrawProbability(b) - this.getDrawProbability(a))
                                .map(card => {
                                const width = this.getDrawProbability(card).toLocaleString(undefined, {style: 'percent'});
                                const barStyle: CSS.Properties = {
                                    width: width
                                };
                                return (
                                    <div className="card-row">
                                        <div className="card-name">{card}</div>
                                        <div className="card-actions">
                                            <button className="positive" onClick={() => this.drawCard(card)}>
                                                Draw
                                            </button>
                                            <button className="negative" onClick={() => this.drawEpidemicCard(card)}>
                                                Epidemic
                                            </button>
                                            <button className="neutral" onClick={() => this.removeCard(card)}>
                                                Remove
                                            </button>
                                        </div>
                                        <div className="percent-container">
                                            <div className="draw-probability" style={barStyle}>{width}</div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className="right-container">
                        <div className="pile discard">
                            {
                                this.state.deck[0].map(card => <div>{card}</div>)
                            }
                        </div>
                        {
                            this.state.deck.slice(1, this.state.deck.length).map((pile, i) => {
                                return (
                                    <div className="pile">
                                        { pile
                                            .filter((c, i) => { return pile.indexOf(c) === i; })
                                            .map(card => 
                                                <div>
                                                    {card + (this.numInstancesInArr(pile, card) > 1 ? " x" + this.numInstancesInArr(pile, card) : "")}
                                                </div>
                                            )
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="bottom-container">
                    <button className="neutral" onClick={this.undo} disabled={this.state.prev === undefined ? true : false}>Undo</button>
                </div>
            </div>
        );
    }

    getDrawProbability = (card: string) : number => {
        return this.numInstancesInArr(this.state.deck[1], card) / this.state.deck[1].length;
    }

    removeFromArr = <T extends unknown>(arr: T[], val: T) : boolean => {
        const i = arr.indexOf(val);
        if (i >= 0) {
            arr.splice(i, 1);
            return true;
        }
        return false;
    }

    numInstancesInArr = <T extends unknown>(arr: T[], val: T) : number => {
        let numInstances = 0;
        arr.forEach(el => numInstances += el === val ? 1 : 0);
        return numInstances; 
    }

    copyState = (state: GameState) : GameState => {
        return {
            deck: Object.assign([], state.deck.map(pile => Object.assign([], pile))),
            prev: state.prev === undefined ? undefined : this.copyState(state.prev as GameState)
        }
    }
}

/*

Started -> Not Started
Not Started -> Started
Started -> Epidemic
Epidemic -> Started

game -> cards
game -> deck

*/
