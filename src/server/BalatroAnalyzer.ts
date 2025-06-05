import { Card } from "./enum/cards/Card";
import { Type } from "./enum/cards/CardType";
import { Deck } from "./enum/Deck";
import { Edition } from "./enum/Edition";
import { PackKind } from "./enum/packs/PackKind";
import { Stake } from "./enum/Stake";
import { Version } from "./enum/Version";
import { Game } from "./Game";
import { AnalysisParams } from "./interface/AnalysisParams";
import { Configurations } from "./interface/Configurations";
import { ItemImpl } from "./interface/Item";
import { Result } from "./Result";
import { Run } from "./Run";
import { AbstractCard } from "./struct/AbstractCard";
import { CardNameBuilder } from "./struct/CardNameBuilder";
import { InstanceParams } from "./struct/InstanceParams";
import { JokerData } from "./struct/JokerData";
import { Option } from "./struct/Option";

interface AnalysisResult {
    antes: AnteResult[];
}

interface AnteResult {
    ante: number;
    cards: Card[];
    options: Option[];
}

export class BalatroAnalyzer {
    static readonly OPTIONS: ReadonlyArray<string> = [
        // Tags
        "Negative Tag",
        "Foil Tag",
        "Holographic Tag",
        "Polychrome Tag",
        "Rare Tag",

        // Special Cards
        "Golden Ticket",

        // Characters
        "Mr. Bones",
        "Acrobat",
        "Sock and Buskin",
        "Swashbuckler",
        "Troubadour",

        // Items & Certificates
        "Certificate",
        "Smeared Joker",
        "Throwback",
        "Hanging Chad",

        // Gems & Materials
        "Rough Gem",
        "Bloodstone",
        "Arrowhead",
        "Onyx Agate",
        "Glass Joker",

        // Performance & Entertainment
        "Showman",
        "Flower Pot",
        "Blueprint",
        "Wee Joker",
        "Merry Andy",

        // Special Effects
        "Oops! All 6s",
        "The Idol",
        "Seeing Double",
        "Matador",
        "Hit the Road",

        // Card Sets
        "The Duo",
        "The Trio",
        "The Family",
        "The Order",
        "The Tribe",

        // Special Characters
        "Stuntman",
        "Invisible Joker",
        "Brainstorm",
        "Satellite",
        "Shoot the Moon",

        // Licenses & Professions
        "Driver's License",
        "Cartomancer",
        "Astronomer",
        "Burnt Joker",
        "Bootstraps",

        // Shop & Economy
        "Overstock Plus",
        "Liquidation",
        "Glow Up",
        "Reroll Glut",
        "Omen Globe",

        // Tools & Equipment
        "Observatory",
        "Nacho Tong",
        "Recyclomancy",

        // Merchants
        "Tarot Tycoon",
        "Planet Tycoon",

        // Special Items
        "Money Tree",
        "Antimatter",
        "Illusion",
        "Petroglyph",
        "Retcon",
        "Palette"
    ] as const;
    // seed: string;
    ante: number;
    cardsPerAnte: number[];
    deck: Deck;
    stake: Stake;
    version: Version;
    configurations: Configurations;
    result: Result;


    constructor(ante: number, cardsPerAnte: number[], deck: Deck, stake: Stake, version: Version, configurations: Configurations) {
        // this.seed = seed;
        this.ante = ante;
        this.cardsPerAnte = cardsPerAnte;
        this.deck = deck;
        this.stake = stake;
        this.version = version;
        this.configurations = configurations;
        this.result = new Result();
    }

    performAnalysis({ seed, ante, cardsPerAnte, deck, stake, version }: AnalysisParams): { run: Run, game: Game } {
        if (ante > cardsPerAnte.length) {
            throw new Error(`cardsPerAnte array does not have enough elements for ante ${ante}`);
        }

        const selectedOptions: boolean[] = new Array(BalatroAnalyzer.OPTIONS.length).fill(true);
        const game = new Game(seed, new InstanceParams(deck, stake, false, version.getVersion()));
        game.initLocks(1, false, false);
        game.firstLock();

        this.lockOptions(game, selectedOptions);
        game.setDeck(deck);

        const run = new Run(seed);

        for (let a = 1; a <= ante; a++) {
            this.result.setCurrentAnte = a;
            this.processAnte(game, run, a, cardsPerAnte[a - 1], selectedOptions);
        }

        return { run, game };
    }

    private lockOptions(game: Game, selectedOptions: boolean[]): void {
        for (let i = 0; i < BalatroAnalyzer.OPTIONS.length; i++) {
            if (!selectedOptions[i]) {
                game.lock(BalatroAnalyzer.OPTIONS[i]);
            }
        }
    }

    private processAnte(game: Game, run: Run, ante: number, cardsCount: number, selectedOptions: boolean[]): void {
        game.initUnlocks(ante, false);

        const voucher = game.nextVoucher(ante).getName();
        game.lock(voucher);
        this.result.addVoucher(voucher);

        this.unlockVouchers(game, voucher, selectedOptions);

        if (this.configurations.analyzeShopQueue) {
            for (let i = 0; i < cardsCount; i++) {
                this.processShopItem(game, run, ante);
            }
        }

        const numPacks = ante === 1 ? 4 : 6;
        for (let p = 1; p <= numPacks; p++) {
            this.processPack(game, run, ante, p);
        }
    }

    private unlockVouchers(game: Game, voucher: string, selectedOptions: boolean[]): void {
        for (let i = 0; i < Game.VOUCHERS.length; i += 2) {
            if (Game.VOUCHERS[i].getName() === voucher) {
                if (selectedOptions[BalatroAnalyzer.OPTIONS.indexOf(Game.VOUCHERS[i + 1].getName())]) {
                    game.unlock(Game.VOUCHERS[i + 1].getName());
                }
            }
        }
    }

    private processShopItem(game: Game, run: Run, ante: number): void {
        const shopItem = game.nextShopItem(ante);
        let sticker: Edition | null = null;

        if (shopItem.type === Type.JOKER) {
            run.addJoker(shopItem.jokerData.joker.getName());
            sticker = BalatroAnalyzer.getSticker(shopItem.jokerData);
            this.result.addItemToShopQueue(shopItem.jokerData);
        } else {
            this.result.addItemToShopQueue(shopItem.item as Card);
        }
        // console.log(` Card ${i + 1}: ${shopItem.item.getName()} ${sticker ? `(${new EditionItem(sticker).getName()})` : ""}`);
    }

    private processPack(game: Game, run: Run, ante: number, packNumber: number): void {
        const pack = game.nextPack(ante);
        const packInfo = game.packInfo(pack);
        const options = new Set<Option>();

        let cards;
        switch (packInfo.getKind()) {
            case PackKind.CELESTIAL:
                cards = game.nextCelestialPack(packInfo.getSize(), ante);
                break;
            case PackKind.ARCANA:
                cards = game.nextArcanaPack(packInfo.getSize(), ante);
                break;
            case PackKind.SPECTRAL:
                cards = game.nextSpectralPack(packInfo.getSize(), ante);
                break;
            case PackKind.BUFFOON:
                cards = game.nextBuffoonPack(packInfo.getSize(), ante);
                break;
            case PackKind.STANDARD:
                cards = game.nextStandardPack(packInfo.getSize(), ante);
                break;
        }

        for (let c = 0; c < packInfo.getSize(); c++) {
            this.processCard(run, packInfo, cards[c], options);
        }

        this.result.addPackToQueue(packInfo.getKind(), cards as (Card | JokerData)[]);

        // console.log(` Pack ${packNumber}: ${packInfo.getKind()}`);
        // console.log(`  Options:`);
        // for (const option of options) {
        //     console.log(`-   ${option.name.getName()}`);
        // }
    }

    private processCard(run: Run, packInfo: any, card: any, options: Set<Option>): void {
        if (packInfo.getKind() === PackKind.BUFFOON) {
            const joker: JokerData = card as JokerData;
            const sticker = BalatroAnalyzer.getSticker(joker);
            run.addJoker(joker.joker.getName());
            options.add(new Option(joker.joker, new ItemImpl(sticker)));
        } else if (packInfo.getKind() === PackKind.STANDARD) {
            const cardObj: Card = card as Card;
            const cardName = new CardNameBuilder(cardObj).build();
            options.add(new Option(new AbstractCard(cardName), new ItemImpl(Edition.NO_EDITION)));
        } else {
            if ((card as ItemImpl).getName() === "The Soul") {
                run.hasTheSoul = true;
            }
            options.add(new Option(card as ItemImpl, new ItemImpl(Edition.NO_EDITION)));
        }
    }

    private static getSticker(joker: JokerData): Edition {
        if (joker.stickers.eternal) return Edition.ETERNAL;
        if (joker.stickers.perishable) return Edition.PERISHABLE;
        if (joker.stickers.rental) return Edition.RENTAL;
        if (joker.edition !== Edition.NO_EDITION) return joker.edition;
        return Edition.NO_EDITION;
    }
}