export default class GameStart {
    getInitialCards = () : string[] => {
        let initial_cards = [] as string[];
        this.putValuesInArr(initial_cards, 'Tripoli', 3);
        this.putValuesInArr(initial_cards, 'Cairo', 3);
        this.putValuesInArr(initial_cards, 'Istanbul', 3);
        this.putValuesInArr(initial_cards, 'Lagos', 3);
        this.putValuesInArr(initial_cards, 'Jacksonville', 3);
        this.putValuesInArr(initial_cards, 'Sao Paulo', 3);
        this.putValuesInArr(initial_cards, 'London', 3);
        this.putValuesInArr(initial_cards, 'New York', 3);
        this.putValuesInArr(initial_cards, 'Washington', 3);
        this.putValuesInArr(initial_cards, 'Chicago', 2);
        this.putValuesInArr(initial_cards, 'Denver', 2);
        this.putValuesInArr(initial_cards, 'Atlanta', 1);
        this.putValuesInArr(initial_cards, 'Buenos Aires', 2);
        return initial_cards;
    }
    putValuesInArr = <T extends unknown>(arr: T[], val: T, n: number) => {
        for (let i = 0; i < n; i++) {
            arr.push(val);
        }
    }
}