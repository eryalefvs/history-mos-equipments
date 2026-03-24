export class ListEquipmentsUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute() {
        return this.repository.listEquipments();
    }
}
//# sourceMappingURL=ListEquipmentsUseCase.js.map