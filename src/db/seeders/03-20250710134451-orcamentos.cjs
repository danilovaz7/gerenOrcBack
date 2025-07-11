'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('orcamentos', [
      {
        usuario_id: 2,
        forma_pagamento: 'A vista',
        valor_total: 2500.00,
        arquivo_pdf: 'adpuiofhgiuJWDSNGFIrewngi',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        usuario_id: 2,
        forma_pagamento: 'Parcelado',
        valor_total: 199.89,
        arquivo_pdf: 'SNMDVOJSDNOFSDNVKNV',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orcamentos', null);
  }
};
