class RecintosZoo {
    constructor() {
        this.acceptedAnimals = [
            { species: "LEAO", size: 3, biomes: ["savana"] },
            { species: "LEOPARDO", size: 2, biomes: ["savana"] },
            { species: "CROCODILO", size: 3, biomes: ["rio"] },
            { species: "MACACO", size: 1, biomes: ["savana", "floresta"] },
            { species: "GAZELA", size: 2, biomes: ["savana"] },
            { species: "HIPOPOTAMO", size: 4, biomes: ["savana", "rio"] }
        ];

        this.availableEnclosures = [
            { number: 1, biome: "savana", totalSize: 10, animals: [{ species: "MACACO", quantity: 3 }] },
            { number: 2, biome: "floresta", totalSize: 5, animals: [] },
            { number: 3, biome: "savana e rio", totalSize: 7, animals: [{ species: "GAZELA", quantity: 1 }] },
            { number: 4, biome: "rio", totalSize: 8, animals: [] },
            { number: 5, biome: "savana", totalSize: 9, animals: [{ species: "LEAO", quantity: 1 }] }
        ];
    }

    analisaRecintos(animal, quantidade) {
        let errorChecker = this.theEntryIsInvalid(animal, quantidade);
        if (errorChecker.isError) {
            return { erro: errorChecker.errorType };
        }

        let suitableEnclosures = this.findSuitableEnclosures(animal, quantidade);
        if (suitableEnclosures.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return {
            recintosViaveis: suitableEnclosures.map(e =>
                `Recinto ${e.number} (espaço livre: ${e.freeSpace} total: ${e.totalSize})`
            )
        };
    }

    theEntryIsInvalid(animal, quantidade) {
        if (quantidade <= 0) {
            return { isError: true, errorType: "Quantidade inválida" };
        }

        const foundAnimal = this.acceptedAnimals.find(a => a.species === animal);
        if (!foundAnimal) {
            return { isError: true, errorType: "Animal inválido" };
        }

        return { isError: false, errorType: "" };
    }

    findSuitableEnclosures(animal, quantidade) {
        const animalInfo = this.acceptedAnimals.find(a => a.species === animal);
        const requiredSpace = animalInfo.size * quantidade;
        const isCarnivore = ["LEAO", "LEOPARDO", "CROCODILO"].includes(animal);
    
        return this.availableEnclosures.filter(enclosure => {
            const enclosureOccupiedSpace = this.calculateOccupiedSpace(enclosure.animals);
            const freeSpace = enclosure.totalSize - enclosureOccupiedSpace;
    
            if (!animalInfo.biomes.includes(enclosure.biome) && enclosure.biome !== "savana e rio") {
                return false;
            }
    
            if (freeSpace < requiredSpace) {
                return false;
            }
    
            if (isCarnivore && enclosure.animals.length > 0) {
                return enclosure.animals.every(a => a.species === animal);
            }
    
            if (animal === "HIPOPOTAMO" && enclosure.biome !== "savana e rio" && enclosure.animals.length > 0) {
                return false;
            }
    
            if (animal === "MACACO" && enclosure.animals.length === 0) {
                return false;
            }
    
            if (!this.animalsRemainComfortable(enclosure.animals, animal, quantidade, enclosure.biome)) {
                return false;
            }
    
            return true;
        }).map(enclosure => ({
            ...enclosure,
            freeSpace: enclosure.totalSize - (this.calculateOccupiedSpace(enclosure.animals) + requiredSpace)
        })).sort((a, b) => a.number - b.number); // Ordena os recintos pelo número
    }

    calculateOccupiedSpace(animals) {
        let totalSpace = animals.reduce((acc, a) => {
            const animalInfo = this.acceptedAnimals.find(info => info.species === a.species);
            return acc + animalInfo.size * a.quantity;
        }, 0);

        if (animals.length > 1) {
            totalSpace += 1;
        }

        return totalSpace;
    }

    animalsRemainComfortable(existingAnimals, newAnimal, newQuantity, biome) {
        for (let animal of existingAnimals) {
            if (animal.species === "HIPOPOTAMO" && biome !== "savana e rio") {
                return false;
            }

            if (["LEAO", "LEOPARDO", "CROCODILO"].includes(animal.species)) {
                if (animal.species !== newAnimal) {
                    return false;
                }
            }
        }
        return true;
    }
}

export { RecintosZoo as RecintosZoo };
