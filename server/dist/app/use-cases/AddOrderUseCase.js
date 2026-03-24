export class AddOrderUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(slug, order) {
        await this.repository.add(slug, order);
    }
}
//# sourceMappingURL=AddOrderUseCase.js.map