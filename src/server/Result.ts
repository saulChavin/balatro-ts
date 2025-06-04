import { Card } from "./enum/cards/Card";
import { Edition } from "./enum/Edition";
import { PackKind } from "./enum/packs/PackKind";
import { JokerData } from "./struct/JokerData";

export interface IResult {
	ante: number;
	voucher: string;
	shop: (Card | JokerData)[];
	packs: {
		kind: PackKind;
		cards: (Card | JokerData)[];
	}[];
}

export class Result {
	currentAnte: number;
	private result: IResult[] = [];

	constructor() {
		this.currentAnte = 1
	}

	set setCurrentAnte(ante: number) {
		if (ante < 1) {
			throw new Error("Ante must be at least 1");
		}
		this.currentAnte = ante;
	}

	get ante(): number {
		return this.currentAnte;
	}

	get getResult(): IResult[] {
		return this.result;
	}

	addVoucher(voucher: string) {
		this.result[this.currentAnte - 1] = {
			...this.result[this.currentAnte - 1],
			voucher: voucher,
			ante: this.currentAnte,
		}
	}

	addItemToShopQueue(item:Card | JokerData) {
		if (!this.result[this.currentAnte - 1]?.shop) {
			this.result[this.currentAnte - 1] = {
				...this.result[this.currentAnte - 1],
				shop: [],
			};
		}
		this.result[this.currentAnte - 1].shop.push(item);
	}

	addPackToQueue(kind: PackKind, cards: (Card | JokerData)[]) {
		if (!this.result[this.currentAnte - 1]?.packs) {
			this.result[this.currentAnte - 1] = {
				...this.result[this.currentAnte - 1],
				packs: [],
			};
		}
		this.result[this.currentAnte - 1].packs.push({
			kind,
			cards,
		});
	}



}