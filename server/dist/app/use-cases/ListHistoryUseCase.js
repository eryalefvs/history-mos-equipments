export class ListHistoryUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(slug) {
        return this.repository.listAll(slug);
    }
}
//# sourceMappingURL=ListHistoryUseCase.js.map