import React from 'react';
import CSS from 'csstype';

interface GameProps {
    cards: string[]
}

interface GameState {
    deck: string[][],
    prev?: GameState,
    numDraws?: number
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
        if (this.state.deck.length <= 1 
            || !this.removeFromArr(this.state.deck[1], card)) 
            return;
        if (this.state.deck[1].length === 0) { this.state.deck.splice(1, 1); }
        this.state.deck[0].push(card);
        this.setState({
            deck: this.state.deck,
            prev: prevState
        });
    }

    drawEpidemicCard = (card: string) => {
        const prevState = this.copyState(this.state);
        if (this.state.deck.length <= 1 
            || !this.removeFromArr(this.state.deck[this.state.deck.length - 1], card)) 
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
                                .sort((a, b) => { 
                                    const prob = this.getDrawProbability(b) - this.getDrawProbability(a); 
                                    if (prob > 0) return 1;
                                    else if (prob < 0) return -1;
                                    return b < a ? 1 : -1;
                                })
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
                                this.state.deck[0]
                                    .filter((c, i) => { return this.state.deck[0].indexOf(c) === i; })
                                    .sort((a, b) => b < a ? 1 : -1)
                                    .map(card => 
                                        <div>
                                            <span>{card}</span>
                                            <div className="dots">
                                                {
                                                    Array.from(Array(this.numInstancesInArr(this.state.deck[0], card)).keys())
                                                        .map(() => <span className="dot"></span>)
                                                }
                                            </div>
                                        </div>)
                            }
                        </div>
                        {
                            this.state.deck.slice(1, this.state.deck.length).map((pile, i) => {
                                return (
                                    <div className="pile">
                                        { pile
                                            .filter((c, i) => { return pile.indexOf(c) === i; })
                                            .sort((a, b) => b < a ? 1 : -1)
                                            .map(card => 
                                                <div>
                                                    <span>{card}</span>
                                                    <div className="dots">
                                                        {
                                                            Array.from(Array(this.numInstancesInArr(pile, card)).keys())
                                                                .map(() => <span className="dot"></span>)
                                                        }
                                                    </div>
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
                    <div className="slider-container">
                        <input 
                            type="range" 
                            min={1} 
                            max={4} 
                            value={this.state.numDraws === undefined ? 1 : this.state.numDraws}
                            list="steplist"
                            className="slider" onChange={e => {
                                this.setState({
                                    deck: this.state.deck,
                                    prev: this.state.prev,
                                    numDraws: parseInt(e.target.value)
                                });
                            }} />
                        <datalist id="steplist">
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                        </datalist>
                    </div>
                    <span>{this.state.numDraws === undefined ? 1 : this.state.numDraws}</span>
                </div>
            </div>
        );
    }

    getDrawProbability = (card: string) : number => {
        if (this.state.deck.length <= 1) { return 0; }
        let draws = this.state.numDraws === undefined ? 1 : this.state.numDraws;
        let pileIndex = 1;
        while (draws >= 0 && pileIndex < this.state.deck.length) {
            if (this.state.deck[pileIndex].length <= draws && this.numInstancesInArr(this.state.deck[pileIndex], card) > 0) { return 1; }
            else if (this.state.deck[pileIndex].length > draws) {
                return this.r_getDrawProbability(this.state.deck[pileIndex], card, draws);
            }
            draws -= this.state.deck[pileIndex].length;
            pileIndex++;
        }
        return 0;
    }

    //this should only get called when draws is less than pile length
    r_getDrawProbability = (pile: string[], card: string, draws: number) : number => {
        if (draws <= 0) return 0;
        draws = draws > pile.length ? pile.length : draws;
        return pile.reduce((total, c, i) => {
            if (c === card)
                return total + 1;
            let remainingDeck = Object.assign([], pile);
            remainingDeck.splice(i, 1);
            return total + this.r_getDrawProbability(remainingDeck, card, draws - 1);
        }, 0) / pile.length;
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
