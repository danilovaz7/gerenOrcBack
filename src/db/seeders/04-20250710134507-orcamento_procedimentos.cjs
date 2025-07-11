'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('orcamento_procedimentos', [
      {
        usuario_id: 2,
        orcamento_id: 1,
        nome_procedimento: 'Babadoplastia',
        obs_procedimento: 'Alergia a injecao A',
        valor_procedimento: 500.00,
        foto_antes: '235234512351345',
        foto_depois: '235234512351345',
        status_retorno: 'aguardando procedimento',
        num_retorno: 0,
        dt_realizacao: new Date(),
        dt_ultimo_retorno: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        usuario_id: 2,
        orcamento_id: 1,
        nome_procedimento: 'Buchectomia',
        obs_procedimento: '',
        valor_procedimento: 1290.00,
        foto_antes: '2352345asdasdasd12351345',
        foto_depois: 'afacac',
        status_retorno: 'retorno',
        num_retorno: 2,
        dt_realizacao: new Date(),
        dt_ultimo_retorno: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        usuario_id: 2,
        orcamento_id: 2,
        nome_procedimento: 'Papado lipo',
        obs_procedimento: 'Ja realizado em outra clinica',
        valor_procedimento: 2000.00,
        foto_antes: 'scasdasc',
        foto_depois: 'afaazzzcxzcac',
        status_retorno: 'retorno',
        num_retorno: 1,
        dt_realizacao: new Date(),
        dt_ultimo_retorno: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        usuario_id: 2,
        orcamento_id: 2,
        nome_procedimento: 'Remocao gordura olho',
        obs_procedimento: 'Cicatriz ao lado, cuidado',
        valor_procedimento: 120.00,
        foto_antes: 'asdasdasd',
        foto_depois: 'afaazzzcaaaaaaxzcac',
        status_retorno: 'finalizado',
        num_retorno: 3,
        dt_realizacao: new Date(),
        dt_ultimo_retorno: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orcamento_procedimentos', null);
  }
};
