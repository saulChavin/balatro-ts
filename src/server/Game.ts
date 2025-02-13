import { Lock } from "./Lock";
import { Tarot, TarotEnum } from "./enum/cards/Tarot";
import { Planet, PlanetItem } from "./enum/cards/Planet";
import { Spectral, SpectralItem } from "./enum/packs/Spectral";
import { LegendaryJoker, LegendaryJokerItem } from "./enum/cards/LegendaryJoker";
import { UncommonJoker, UncommonJokerItem } from "./enum/cards/UncommonJoker";
import { UncommonJoker101CItem, UncommonJoker_101C } from "./enum/cards/UncommonJoker_101C";
import { UncommonJoker100Item, UncommonJoker_100 } from "./enum/cards/UncommonJoker_100";
import { Card, PlayingCard } from "./enum/cards/Card";
import { Enhancement, EnhancementItem } from "./enum/Enhancement";
import { Voucher, VoucherItem } from "./enum/Voucher";
import { Tag, TagItem } from "./enum/Tag";
import { PackType, PackTypeItem } from "./enum/packs/PackType";
import { RareJoker, RareJokerItem } from "./enum/cards/RareJoker";
import { RareJoker101CItem, RareJoker_101C } from "./enum/cards/RareJoker_101C";
import { RareJoker100Item, RareJoker_100 } from "./enum/cards/RareJoker_100";
import { CommonJoker, CommonJokerCard } from "./enum/cards/CommonJoker";
import { CommonJoker_100, CommonJoker_100Card } from "./enum/cards/CommonJoker_100";
import { BossBlind, BossBlindEnum } from "./enum/BossBlind";
import { InstanceParams } from "./struct/InstanceParams";
import { LuaRandom, pseudohash, round13 } from "./utils/LuaRandom";
import { Cache } from "./Cache";
import { ItemImpl } from "./interface/Item";
import { Specials, SpecialsItem } from "./enum/cards/Specials";
import { JokerData } from "./struct/JokerData";
import { Edition, EditionItem } from "./enum/Edition";
import { JokerStickers } from "./struct/JokerStickers";
import { StakeType } from "./enum/Stake";
import { JokerImpl } from "./interface/Joker";
import { ShopInstance } from "./struct/ShopInstance";
import { Deck, DeckType } from "./enum/Deck";
import { ShopItem } from "./struct/ShopItem";
import { CardType, Type } from "./enum/cards/CardType";
import { PackInfo } from "./struct/PackInfo";
import { Seal, SealItem } from "./enum/Seal";

export class Game extends Lock {
    private static _tarots: Tarot[] | null = null;
    private static _planets: PlanetItem[] | null = null;
    private static _spectrals: SpectralItem[] | null = null;
    private static _legendaryJokers: LegendaryJokerItem[] | null = null;
    private static _uncommonJokers: UncommonJokerItem[] | null = null;
    private static _uncommonJokers101C: UncommonJoker101CItem[] | null = null;
    private static _uncommonJokers100: UncommonJoker100Item[] | null = null;
    private static _cards: Card[] | null = null;
    private static _enhancements: EnhancementItem[] | null = null;
    private static _vouchers: VoucherItem[] | null = null;
    private static _tags: TagItem[] | null = null;
    private static _packs: PackTypeItem[] | null = null;
    private static _rareJokers: RareJokerItem[] | null = null;
    private static _rareJokers101C: RareJoker101CItem[] | null = null;
    private static _rareJokers100: RareJoker100Item[] | null = null;
    private static _commonJokers: CommonJokerCard[] | null = null;
    private static _commonJokers100: CommonJoker_100Card[] | null = null;
    private static _bossBlind: BossBlind[] | null = null;

    static get TAROTS(): Tarot[] {
        if (!this._tarots) {
            this._tarots = Object.values(TarotEnum).map(tarot => new Tarot(tarot));
        }
        return this._tarots;
    }

    static get PLANETS(): PlanetItem[] {
        if (!this._planets) {
            this._planets = Object.values(Planet).map(planet => new PlanetItem(planet));
        }
        return this._planets;
    }

    static get SPECTRALS(): SpectralItem[] {
        if (!this._spectrals) {
            this._spectrals = Object.values(Spectral).map(spectral => new SpectralItem(spectral));
        }
        return this._spectrals;
    }

    static get LEGENDARY_JOKERS(): LegendaryJokerItem[] {
        if (!this._legendaryJokers) {
            this._legendaryJokers = Object.values(LegendaryJoker).map(joker => new LegendaryJokerItem(joker));
        }
        return this._legendaryJokers;
    }

    static get UNCOMMON_JOKERS(): UncommonJokerItem[] {
        if (!this._uncommonJokers) {
            this._uncommonJokers = Object.values(UncommonJoker).map(joker => new UncommonJokerItem(joker));
        }
        return this._uncommonJokers;
    }

    static get UNCOMMON_JOKERS_101C(): UncommonJoker101CItem[] {
        if (!this._uncommonJokers101C) {
            this._uncommonJokers101C = Object.values(UncommonJoker_101C).map(joker => new UncommonJoker101CItem(joker));
        }
        return this._uncommonJokers101C;
    }

    static get UNCOMMON_JOKERS_100(): UncommonJoker100Item[] {
        if (!this._uncommonJokers100) {
            this._uncommonJokers100 = Object.values(UncommonJoker_100).map(joker => new UncommonJoker100Item(joker));
        }
        return this._uncommonJokers100;
    }

    static get CARDS(): Card[] {
        if (!this._cards) {
            this._cards = Object.values(PlayingCard).map(card => new Card(card));
        }
        return this._cards;
    }

    static get ENHANCEMENTS(): EnhancementItem[] {
        if (!this._enhancements) {
            this._enhancements = Object.values(Enhancement).map(enhancement => new EnhancementItem(enhancement));
        }
        return this._enhancements;
    }

    static get VOUCHERS(): VoucherItem[] {
        if (!this._vouchers) {
            this._vouchers = Object.values(Voucher).map(voucher => new VoucherItem(voucher));
        }
        return this._vouchers;
    }

    static get TAGS(): TagItem[] {
        if (!this._tags) {
            this._tags = Object.values(Tag).map(tag => new TagItem(tag));
        }
        return this._tags;
    }

    static get PACKS(): PackTypeItem[] {
        if (!this._packs) {
            this._packs = Object.values(PackType).map(pack => new PackTypeItem(pack, PackTypeItem.VALUES[pack]));
        }
        return this._packs;
    }

    static get RARE_JOKERS(): RareJokerItem[] {
        if (!this._rareJokers) {
            this._rareJokers = Object.values(RareJoker).map(joker => new RareJokerItem(joker));
        }
        return this._rareJokers;
    }

    static get RARE_JOKERS_101C(): RareJoker101CItem[] {
        if (!this._rareJokers101C) {
            this._rareJokers101C = Object.values(RareJoker_101C).map(joker => new RareJoker101CItem(joker));
        }
        return this._rareJokers101C;
    }

    static get RARE_JOKERS_100(): RareJoker100Item[] {
        if (!this._rareJokers100) {
            this._rareJokers100 = Object.values(RareJoker_100).map(joker => new RareJoker100Item(joker));
        }
        return this._rareJokers100;
    }
    static get COMMON_JOKERS(){
        if(!this._commonJokers){
         return this._commonJokers = Object.values(CommonJoker).map(joker => new CommonJokerCard(joker)); 
        }
        return this._commonJokers;
        }
    static get COMMON_JOKERS_100(){
        if(!this._commonJokers100){
         return this._commonJokers100 = Object.values(CommonJoker_100).map(joker => new CommonJoker_100Card(joker)); 
        }
        return this._commonJokers100;
        }
    static get BOSSES(){
        if(!this._bossBlind){
         return this._bossBlind = Object.values(BossBlindEnum).map(boss => new BossBlind(boss)); 
        }
        return this._bossBlind;
        }

    static readonly SET_A: ReadonlySet<string> = new Set([
        // Food & Drink
        "Gros Michel",
        "Ice Cream",
        "Cavendish",
        "Turtle Bean",
        "Diet Cola",
        "Popcorn",
        "Ramen",
        "Seltzer",

        // Characters
        "Luchador",
        "Mr. Bones",

        // Special
        "Invisible Joker"
    ]);

    static readonly SET_B: ReadonlySet<string> = new Set([
        // Items
        "Ceremonial Dagger",
        "Flash Card",
        "Spare Trousers",

        // Movement/Action
        "Ride the Bus",
        "Runner",
        "Rocket",

        // Special Jokers
        "Green Joker",
        "Square Joker",
        "Wee Joker",

        // Mystic/Supernatural
        "Constellation",
        "Madness",
        "Vampire",

        // Objects
        "Red Card",
        "Obelisk",
        "Lucky Cat",
        "Castle"
    ]);

    private params: InstanceParams;
    private cache: Cache;
    public seed: string;
    public hashedSeed: number;

    constructor(seed: string, params: InstanceParams) {
        super();
        this.seed = seed;
        this.params = params;
        this.cache = new Cache();
        this.hashedSeed = pseudohash(seed);
    }

    private getNode(id: string) {
        var c = this.cache.getNode(id);

        if (c == null) {
            c = pseudohash(id + this.seed);
            this.cache.setNode(id, c);
        }

        var value = round13((c * 1.72431234 + 2.134453429141) % 1);

        this.cache.setNode(id, value);

        return (value + this.hashedSeed) / 2;
    }

    private random(id: string): number {
        const rng = new LuaRandom(this.getNode(id));
        return rng.random();
    }

    private randint(id: string, min: number, max: number) {
        const rng = new LuaRandom(this.getNode(id));
        return rng.randint(min, max);
    }

    randchoice<T extends ItemImpl>(id: string, items: T[]): ItemImpl {
        if (!items || items.length === 0) {
            throw new Error('Items array cannot be empty');
        }

        let item = items[this.randint(id, 0, items.length - 1)];

        if (!this.params.isShowman() && (this.isLocked(item) || item.getName() === "RETRY")) {
            let resample = 2;
            while (true) {
                item = items[this.randint(`${id}_resample${resample}`, 0, items.length - 1)];
                resample++;
                if ((!this.isLocked(item) && item.getName() !== "RETRY") || resample > 1000) {
                    return item;
                }
            }
        }
        return item;
    }

    private randchoiceJoker<T extends JokerImpl>(id: string, items: T[]): JokerImpl {
        if (!items || items.length === 0) {
            throw new Error('Items array cannot be empty');
        }

        let item = items[this.randint(id, 0, items.length - 1)];
        if (!this.params.isShowman() && (this.isLocked(item) || item.getName() === "RETRY")) {
            let resample = 2;
            while (true) {
                item = items[this.randint(`${id}_resample${resample}`, 0, items.length - 1)];
                resample++;
                if ((!this.isLocked(item) && item.getName() !== "RETRY") || resample > 1000) {
                    return item;
                }
            }
        }
        return item;
    }


    randweightedchoice(id: string, items: PackTypeItem[]): PackTypeItem {
        const poll: number = this.random(id) * 22.42;
        let idx: number = 1;
        let weight: number = 0;

        while (weight < poll) {
            weight += items[idx].getValue();
            idx++;
        }

        return items[idx - 1];
    }

    nextTarot(source: string, ante: number, soulable: boolean): ItemImpl {
        if (soulable &&
            (this.params.isShowman() || !this.isLocked(Specials.THE_SOUL)) &&
            this.random(`soul_Tarot${ante}`) > 0.997) {
            return new SpecialsItem(Specials.THE_SOUL);
        }
        return this.randchoice<ItemImpl>(`Tarot${source}${ante}`, Game.TAROTS);
    }

    nextPlanet(source: string, ante: number, soulable: boolean): ItemImpl {
        if (soulable &&
            (this.params.isShowman() || !this.isLocked(Specials.BLACKHOLE)) &&
            this.random(`soul_Planet${ante}`) > 0.997) {
            return new SpecialsItem(Specials.BLACKHOLE);
        }
        return this.randchoice(`Planet${source}${ante}`, Game.PLANETS);
    }

    nextSpectral(source: string, ante: number, soulable: boolean): ItemImpl {
        if (soulable) {
            let forcedKey: ItemImpl | null = null;

            if ((this.params.isShowman() || !this.isLocked(Specials.THE_SOUL)) &&
                this.random(`soul_Spectral${ante}`) > 0.997) {
                forcedKey = new SpecialsItem(Specials.THE_SOUL);
            }

            if ((this.params.isShowman() || !this.isLocked(Specials.BLACKHOLE)) &&
                this.random(`soul_Spectral${ante}`) > 0.997) {
                forcedKey = new SpecialsItem(Specials.BLACKHOLE);
            }

            if (forcedKey !== null) {
                return forcedKey;
            }
        }
        return this.randchoice(`Spectral${source}${ante}`, Game.SPECTRALS);
    }

    nextJoker(source: string, ante: number, hasStickers: boolean): JokerData {
        // Rarity determination
        let rarity: number;
        switch (source) {
            case 'sou': rarity = 4; break;
            case 'wra': case 'rta': rarity = 3; break;
            case 'uta': rarity = 2; break;
            default: {
                const rarityPoll = this.random(`rarity${ante}${source}`);
                rarity = rarityPoll > 0.95 ? 3 : rarityPoll > 0.7 ? 2 : 1;
            }
        }

        // Edition calculation
        const editionRate = this.isVoucherActive(Voucher.GLOW_UP) ? 4
            : this.isVoucherActive(Voucher.HONE) ? 2 : 1;

        const editionPoll = this.random(`edi${source}${ante}`);
        const edition = editionPoll > 0.997 ? Edition.NEGATIVE
            : editionPoll > 1 - 0.006 * editionRate ? Edition.POLYCHROME
                : editionPoll > 1 - 0.02 * editionRate ? Edition.HOLOGRAPHIC
                    : editionPoll > 1 - 0.04 * editionRate ? Edition.FOIL
                        : Edition.NO_EDITION;

        // Joker selection based on rarity and version
        let joker: JokerImpl;
        const version = this.params.version;

        switch (rarity) {
            case 4:
                joker = this.randchoiceJoker(
                    version > 10099 ? "Joker4" : `Joker4${source}${ante}`,
                    Game.LEGENDARY_JOKERS
                );
                break;
            case 3:
                joker = version > 10103
                    ? this.randchoiceJoker(`Joker3${source}${ante}`, Game.RARE_JOKERS)
                    : version > 10099
                        ? this.randchoiceJoker(`Joker3${source}${ante}`, Game.RARE_JOKERS_101C)
                        : this.randchoiceJoker(`Joker3${source}${ante}`, Game.RARE_JOKERS_100);
                break;
            case 2:
                joker = version > 10103
                    ? this.randchoiceJoker(`Joker2${source}${ante}`, Game.UNCOMMON_JOKERS)
                    : version > 10099
                        ? this.randchoiceJoker(`Joker2${source}${ante}`, Game.UNCOMMON_JOKERS_101C)
                        : this.randchoiceJoker(`Joker2${source}${ante}`, Game.UNCOMMON_JOKERS_100);
                break;
            default:
                joker = version > 10099
                    ? this.randchoiceJoker(`Joker1${source}${ante}`, Game.COMMON_JOKERS)
                    : this.randchoiceJoker(`Joker1${source}${ante}`, Game.COMMON_JOKERS_100);
        }

        // Sticker application
        const stickers = new JokerStickers();
        if (hasStickers) {
            const stake = this.params.getStake();
            const isHighStake = [
                StakeType.BLACK_STAKE, StakeType.BLUE_STAKE, StakeType.PURPLE_STAKE,
                StakeType.ORANGE_STAKE, StakeType.GOLD_STAKE
            ].includes(stake);

            if (version > 10103) {
                if (isHighStake) {
                    const stickerPoll = this.random(
                        `${source === "buf" ? "packetper" : "etperpoll"}${ante}`
                    );

                    if (stickerPoll > 0.7 && !Game.SET_A.has(joker.getName())) {
                        stickers.eternal = true;
                    }

                    if (stickerPoll > 0.4 && stickerPoll <= 0.7 &&
                        [StakeType.ORANGE_STAKE, StakeType.GOLD_STAKE].includes(stake) &&
                        !Game.SET_B.has(joker.getName())) {
                        stickers.perishable = true;
                    }
                }

                if (stake === StakeType.GOLD_STAKE) {
                    stickers.rental = this.random(
                        `${source === "buf" ? "packssjr" : "ssjr"}${ante}`
                    ) > 0.7;
                }
            } else {
                if (isHighStake && !Game.SET_A.has(joker.getName())) {
                    stickers.eternal = this.random(`stake_shop_joker_eternal${ante}`) > 0.7;
                }
                if (version > 10099) {
                    if ([StakeType.ORANGE_STAKE, StakeType.GOLD_STAKE].includes(stake) &&
                        !stickers.eternal) {
                        stickers.perishable = this.random(`ssjp${ante}`) > 0.49;
                    }
                    if (stake === StakeType.GOLD_STAKE) {
                        stickers.rental = this.random(`ssjr${ante}`) > 0.7;
                    }
                }
            }
        }

        return new JokerData(joker, rarity, edition, stickers);
    }

    getShopInstance(): ShopInstance {
        let tarotRate = 4;
        let planetRate = 4;
        let playingCardRate = 0;
        let spectralRate = 0;

        if (this.params.getDeck().name === DeckType.GHOST_DECK) {
            spectralRate = 2;
        }

        if (this.isVoucherActive(Voucher.TAROT_TYCOON)) {
            tarotRate = 32;
        } else if (this.isVoucherActive(Voucher.TAROT_MERCHANT)) {
            tarotRate = 9.6;
        }

        if (this.isVoucherActive(Voucher.PLANET_TYCOON)) {
            planetRate = 32;
        } else if (this.isVoucherActive(Voucher.PLANET_MERCHANT)) {
            planetRate = 9.6;
        }

        if (this.isVoucherActive(Voucher.MAGIC_TRICK)) {
            playingCardRate = 4;
        }

        return new ShopInstance(20, tarotRate, planetRate, playingCardRate, spectralRate);
    }

    nextShopItem(ante: number): ShopItem {
        const shop = this.getShopInstance();
        let cdtPoll = this.random(`cdt${ante}`) * (shop.getTotalRate());
        let type: Type;

        // Determine card type based on rates
        if (cdtPoll < shop.jokerRate) {
            type = Type.JOKER;
        } else {
            cdtPoll -= shop.jokerRate;
            if (cdtPoll < shop.tarotRate) {
                type = Type.TAROT;
            } else {
                cdtPoll -= shop.tarotRate;
                if (cdtPoll < shop.planetRate) {
                    type = Type.PLANET;
                } else {
                    cdtPoll -= shop.planetRate;
                    type = cdtPoll < shop.playingCardRate ? Type.PLAYING_CARD : Type.SPECTRAL;
                }
            }
        }

        // Generate item based on type
        switch (type) {
            case Type.JOKER: {
                const jokerData = this.nextJoker("sho", ante, true);
                return new ShopItem(type, jokerData.joker, jokerData);
            }
            case Type.TAROT:
                return new ShopItem(type, this.nextTarot("sho", ante, false));
            case Type.PLANET:
                return new ShopItem(type, this.nextPlanet("sho", ante, false));
            case Type.SPECTRAL:
                return new ShopItem(type, this.nextSpectral("sho", ante, false));
            default:
                return new ShopItem();
        }
    }

    nextPack(ante: number): PackTypeItem {
        if (ante < 2 && !this.cache.isGeneratedFirstPack() && this.params.version > 10099) {
            this.cache.setGeneratedFirstPack(true);
            return new PackTypeItem(PackType.BUFFOON_PACK, PackTypeItem.VALUES[PackType.BUFFOON_PACK]);
        }
        return this.randweightedchoice(`shop_pack${ante}`, Game.PACKS);
    }

    packInfo(pack: PackTypeItem): PackInfo {
        const getPackSize = () => {
            if (pack.isMega() || pack.isJumbo()) {
                return pack.isBuffoon() || pack.isSpectral() ? 4 : 5;
            } else {
                return pack.isBuffoon() || pack.isSpectral() ? 2 : 3;
            }
        }

        const getChoices = () => {
            if (pack.isMega()) return 2;
            return 1;
        }

        return new PackInfo(pack, getPackSize(), getChoices());
    }

    setDeck(deck: Deck): void {
        this.params.setDeck(deck);

        switch (deck.name) {
            case DeckType.MAGIC_DECK:
                this.activateVoucher(Voucher.CRYSTAL_BALL);
                break;

            case DeckType.NEBULA_DECK:
                this.activateVoucher(Voucher.TELESCOPE);
                break;

            case DeckType.ZODIAC_DECK:
                this.activateVoucher(Voucher.TAROT_MERCHANT);
                this.activateVoucher(Voucher.PLANET_MERCHANT);
                this.activateVoucher(Voucher.OVERSTOCK);
                break;

            default:
                break;
        }
    }

    activateVoucher(voucher: Voucher): void {
        this.params.getVouchers().add(voucher);
        this.lock(voucher);

        // Find voucher index in VOUCHERS array
        const index = Game.VOUCHERS.findIndex(v => v.getName() === voucher);

        // If found and next voucher exists, unlock it
        if (index >= 0 && index + 1 < Game.VOUCHERS.length) {
            const nextVoucher = Game.VOUCHERS[index + 1];
            this.unlock(nextVoucher);
        }
    }

    isVoucherActive(voucher: Voucher): boolean {
        return this.params.getVouchers().has(voucher);
    }

    nextVoucher(ante: number) {
        return this.randchoice(`Voucher${ante}`, Game.VOUCHERS);
    }


    nextTag(ante: number) {
        return this.randchoice(`Tag${ante}`, Game.TAGS);
    }

    nextBoss(ante: number): ItemImpl {
        const bossPool: BossBlind[] = [];
        let numBosses = 0;

        // First pass: Try to find unlocked bosses
        for (const boss of Game.BOSSES) {
            if (!this.isLocked(boss.getName())) {
                if ((ante % 8 === 0 && boss.getName().charAt(0) !== 'T') ||
                    (ante % 8 !== 0 && boss.getName().charAt(0) === 'T')) {
                    bossPool.push(boss);
                    numBosses++;
                }
            }
        }

        // If no bosses found, unlock appropriate bosses and try again
        if (numBosses === 0) {
            for (const boss of Game.BOSSES) {
                if ((ante % 8 === 0 && boss.getName().charAt(0) !== 'T') ||
                    (ante % 8 !== 0 && boss.getName().charAt(0) === 'T')) {
                    this.unlock(boss.getName());
                }
            }
            return this.nextBoss(ante);
        }

        const chosenBoss = this.randchoice(`boss`, bossPool);
        this.lock(chosenBoss);
        return chosenBoss;
    }

    nextStandardCard(ante: number): Card {
        let enhancement;
        if (this.random(`stdset${ante}`) <= 0.6) {
            enhancement = "No Enhancement";
        } else {
            enhancement = this.randchoice(`Enhancedsta${ante}`, Game.ENHANCEMENTS).getName();
        }

        let edition = Edition.NO_EDITION;

        const editionPoll = this.random(`standard_edition${ante}`);

        if (editionPoll > 0.988 || editionPoll > 0.96) {
            edition = Edition.POLYCHROME;
        } else if (editionPoll > 0.92) {
            edition = Edition.FOIL;
        }

        let seal = Seal.NO_SEAL;

        if (this.random(`stdseal${ante}`) > 0.8) {
            const sealPoll = this.random(`stdsealtype${ante}`);
            if (sealPoll > 0.75) {
                seal = Seal.RED_SEAL;
            } else if (sealPoll > 0.5) {
                seal = Seal.BLUE_SEAL;
            } else if (sealPoll > 0.25) {
                seal = Seal.GOLD_SEAL;
            } else {
                seal = Seal.PURPLE_SEAL;
            }
        }

        const base = this.randchoice(`frontsta${ante}`, Game.CARDS);

        return new Card(base.getName() as PlayingCard, enhancement, new EditionItem(edition), new SealItem(seal));
    }

    nextArcanaPack(size: number, ante: number) {
        const pack: ItemImpl[] = new Array(size);

        for (let i = 0; i < size; i++) {
            if (this.isVoucherActive(Voucher.OMEN_GLOBE) && this.random("omen_globe") > 0.8) {
                pack[i] = this.nextSpectral("ar2", ante, true);
            } else {
                pack[i] = this.nextTarot("ar1", ante, true);
            }
            if (!this.params.isShowman()) {
                this.lock(pack[i].getName());
            }
        }

        if (this.params.isShowman()) return pack;

        for (let i = 0; i < size; i++) {
            this.unlock(pack[i].getName());
        }

        return pack;
    }

    nextCelestialPack(size: number, ante: number): ItemImpl[] {
        const pack: ItemImpl[] = new Array(size);

        for (let i = 0; i < size; i++) {
            pack[i] = this.nextPlanet("pl1", ante, true);
            if (!this.params.isShowman()) {
                this.lock(pack[i].getName());
            }
        }

        if (this.params.isShowman()) return pack;

        for (let i = 0; i < size; i++) {
            this.unlock(pack[i].getName());
        }

        return pack;
    }

    nextSpectralPack(size: number, ante: number): ItemImpl[] {
        const pack: ItemImpl[] = new Array(size);

        for (let i = 0; i < size; i++) {
            pack[i] = this.nextSpectral("spe", ante, true);

            if (!this.params.isShowman()) {
                this.lock(pack[i].getName());
            }
        }

        if (this.params.isShowman()) return pack;

        for (let i = 0; i < size; i++) {
            this.unlock(pack[i].getName());
        }

        return pack;
    }

    nextStandardPack(size: number, ante: number): Card[] {
        const pack: Card[] = new Array(size);

        for (let i = 0; i < size; i++) {
            pack[i] = this.nextStandardCard(ante);
        }

        return pack;
    }

    public nextBuffoonPack(size: number, ante: number): JokerData[] {
        const pack: JokerData[] = new Array(size);

        for (let i = 0; i < size; i++) {
            const joker = this.nextJoker("buf", ante, true);
            pack[i] = joker;

            if (!this.params.isShowman()) {
                this.lock(joker.joker.name);
            }
        }

        if (this.params.isShowman()) return pack;

        for (let i = 0; i < size; i++) {
            this.unlock(pack[i].joker.name);
        }

        return pack;
    }

}