export class PostgresOrderRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async listAll(slug) {
        const result = await this.pool.query(`SELECT ordem, data_inicio, data_fim, local_instalacao, tipo_ordem,
              texto_breve, status_usuario, denominacao_local, data_entrada,
              centro_trabalho, tipo_prioridade, centro_trab_responsavel, prioridade
       FROM maintenance_orders
       WHERE equipment_slug = $1
       ORDER BY id`, [slug]);
        return result.rows.map((row) => ({
            ordem: String(row["ordem"] ?? ""),
            dataInicio: String(row["data_inicio"] ?? ""),
            dataFim: String(row["data_fim"] ?? ""),
            localInstalacao: String(row["local_instalacao"] ?? ""),
            tipoOrdem: String(row["tipo_ordem"] ?? ""),
            textoBreve: String(row["texto_breve"] ?? ""),
            statusUsuario: String(row["status_usuario"] ?? ""),
            denominacaoLocal: String(row["denominacao_local"] ?? ""),
            dataEntrada: String(row["data_entrada"] ?? ""),
            centroTrabalho: String(row["centro_trabalho"] ?? ""),
            tipoPrioridade: String(row["tipo_prioridade"] ?? ""),
            centroTrabResponsavel: String(row["centro_trab_responsavel"] ?? ""),
            prioridade: String(row["prioridade"] ?? ""),
        }));
    }
    async add(slug, order) {
        await this.pool.query(`INSERT INTO equipments (slug) VALUES ($1) ON CONFLICT DO NOTHING`, [slug]);
        await this.pool.query(`INSERT INTO maintenance_orders
        (equipment_slug, ordem, data_inicio, data_fim, local_instalacao, tipo_ordem,
         texto_breve, status_usuario, denominacao_local, data_entrada,
         centro_trabalho, tipo_prioridade, centro_trab_responsavel, prioridade)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`, [
            slug,
            order.ordem, order.dataInicio, order.dataFim,
            order.localInstalacao, order.tipoOrdem, order.textoBreve,
            order.statusUsuario, order.denominacaoLocal, order.dataEntrada,
            order.centroTrabalho, order.tipoPrioridade,
            order.centroTrabResponsavel, order.prioridade,
        ]);
    }
    async listEquipments() {
        const result = await this.pool.query(`SELECT slug FROM equipments ORDER BY slug`);
        return result.rows.map((row) => String(row["slug"]));
    }
    async seedEquipment(slug, orders) {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");
            await client.query(`INSERT INTO equipments (slug) VALUES ($1) ON CONFLICT DO NOTHING`, [slug]);
            await client.query(`DELETE FROM maintenance_orders WHERE equipment_slug = $1`, [slug]);
            for (const order of orders) {
                await client.query(`INSERT INTO maintenance_orders
            (equipment_slug, ordem, data_inicio, data_fim, local_instalacao, tipo_ordem,
             texto_breve, status_usuario, denominacao_local, data_entrada,
             centro_trabalho, tipo_prioridade, centro_trab_responsavel, prioridade)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`, [
                    slug,
                    order.ordem, order.dataInicio, order.dataFim,
                    order.localInstalacao, order.tipoOrdem, order.textoBreve,
                    order.statusUsuario, order.denominacaoLocal, order.dataEntrada,
                    order.centroTrabalho, order.tipoPrioridade,
                    order.centroTrabResponsavel, order.prioridade,
                ]);
            }
            await client.query("COMMIT");
        }
        catch (error) {
            await client.query("ROLLBACK");
            throw error;
        }
        finally {
            client.release();
        }
    }
}
//# sourceMappingURL=PostgresOrderRepository.js.map