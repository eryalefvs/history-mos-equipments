export class SeedEquipmentUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(slug, orders) {
        await this.repository.seedEquipment(slug, orders);
    }
}
//# sourceMappingURL=SeedEquipmentUseCase.js.map