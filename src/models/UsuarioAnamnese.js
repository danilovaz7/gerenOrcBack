// src/models/UsuarioAnamnese.js
import database from '../db/database.js';
import { DataTypes } from 'sequelize';
import Usuario from './Usuario.js';

const UsuarioAnamnese = database.define('usuario_anamneses', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' },
    onDelete: 'CASCADE',
  },

  // DADOS COMPLEMENTARES
  comp_trat_odon:        { type: DataTypes.BOOLEAN, allowNull: true },
  comp_trat_odon_obs:    { type: DataTypes.TEXT,    allowNull: true },

  em_trat_medico:        { type: DataTypes.BOOLEAN, allowNull: true },
  em_trat_medico_obs:    { type: DataTypes.TEXT,    allowNull: true },

  transfusao:            { type: DataTypes.BOOLEAN, allowNull: true },
  transfusao_obs:        { type: DataTypes.TEXT,    allowNull: true },

  doenca_grave:          { type: DataTypes.BOOLEAN, allowNull: true },
  doenca_grave_obs:      { type: DataTypes.TEXT,    allowNull: true },

  alergia_geral:         { type: DataTypes.BOOLEAN, allowNull: true },
  alergia_geral_obs:     { type: DataTypes.TEXT,    allowNull: true },

  hospitalizado:         { type: DataTypes.BOOLEAN, allowNull: true },
  hospitalizado_obs:     { type: DataTypes.TEXT,    allowNull: true },

  submetido_cirurgia:    { type: DataTypes.BOOLEAN, allowNull: true },
  cirurgia_obs:          { type: DataTypes.TEXT,    allowNull: true },

  recebeu_anestesia:     { type: DataTypes.BOOLEAN, allowNull: true },
  comp_anestesia:        { type: DataTypes.BOOLEAN, allowNull: true },
  comp_anestesia_obs:    { type: DataTypes.TEXT,    allowNull: true },

  dor_dente:             { type: DataTypes.BOOLEAN, allowNull: true },
  dor_dente_obs:         { type: DataTypes.TEXT,    allowNull: true },

  protese_cardiaca:      { type: DataTypes.BOOLEAN, allowNull: true },
  protese_cardiaca_obs:  { type: DataTypes.TEXT,    allowNull: true },

  sangramento_anormal:   { type: DataTypes.BOOLEAN, allowNull: true },
  sangramento_anormal_obs: { type: DataTypes.TEXT,  allowNull: true },

  // ANAMNESE – lista de checkboxes e campos SIM/NÃO
  tomando_medicamento:   { type: DataTypes.BOOLEAN, allowNull: true },
  tomando_medicamento_obs: { type: DataTypes.TEXT,  allowNull: true },

  cond_diabetes:         { type: DataTypes.BOOLEAN, allowNull: true },
  cond_dist_renais:      { type: DataTypes.BOOLEAN, allowNull: true },
  cond_dormir:           { type: DataTypes.BOOLEAN, allowNull: true },
  cond_coracao:          { type: DataTypes.BOOLEAN, allowNull: true },
  cond_pressao:          { type: DataTypes.BOOLEAN, allowNull: true },
  cond_ulcera:           { type: DataTypes.BOOLEAN, allowNull: true },
  cond_alergia:          { type: DataTypes.BOOLEAN, allowNull: true },
  cond_vitaminas:        { type: DataTypes.BOOLEAN, allowNull: true },
  cond_hormonio:         { type: DataTypes.BOOLEAN, allowNull: true },
  cond_anticoagulante:   { type: DataTypes.BOOLEAN, allowNull: true },
  cond_sist_nervoso:     { type: DataTypes.BOOLEAN, allowNull: true },
  cond_artrite:          { type: DataTypes.BOOLEAN, allowNull: true },
  cond_anticonvulsivante: { type: DataTypes.BOOLEAN, allowNull: true },
  cond_dor_cabeca:       { type: DataTypes.BOOLEAN, allowNull: true },

  alergia_med:           { type: DataTypes.BOOLEAN, allowNull: true },
  alergia_med_obs:       { type: DataTypes.TEXT,    allowNull: true },
  alerg_penincilina:     { type: DataTypes.BOOLEAN, allowNull: true },
  tomou_benzetacil:      { type: DataTypes.BOOLEAN, allowNull: true },
  alerg_sulfa:           { type: DataTypes.BOOLEAN, allowNull: true },
  tomou_bactrim:         { type: DataTypes.BOOLEAN, allowNull: true },
  alerg_ass:             { type: DataTypes.BOOLEAN, allowNull: true },
  alerg_anestesico_loc:  { type: DataTypes.BOOLEAN, allowNull: true },

  pressao_tipo:          { type: DataTypes.ENUM('Baixa','Alta','Não sabe','Normal'), allowNull: true },

  sint_dor_cabeca:       { type: DataTypes.BOOLEAN, allowNull: true },
  sint_tontura:          { type: DataTypes.BOOLEAN, allowNull: true },
  sint_nauseas:          { type: DataTypes.BOOLEAN, allowNull: true },
  sint_dor_nuca:         { type: DataTypes.BOOLEAN, allowNull: true },
  sint_palpitacoes:      { type: DataTypes.BOOLEAN, allowNull: true },
  sint_zumbidos:         { type: DataTypes.BOOLEAN, allowNull: true },
  sint_perda_memoria:    { type: DataTypes.BOOLEAN, allowNull: true },
  sint_perda_equilibrio: { type: DataTypes.BOOLEAN, allowNull: true },

  diabetico:             { type: DataTypes.ENUM('SIM','NÃO','NÃO SABE'), allowNull: true },
  diab_familia:          { type: DataTypes.BOOLEAN, allowNull: true },
  emagreceu:             { type: DataTypes.BOOLEAN, allowNull: true },
  come_muito:            { type: DataTypes.BOOLEAN, allowNull: true },
  urina_freq:            { type: DataTypes.BOOLEAN, allowNull: true },
  muita_sede:            { type: DataTypes.BOOLEAN, allowNull: true },

  prob_respiratorio:     { type: DataTypes.BOOLEAN, allowNull: true },
  resp_asma:             { type: DataTypes.BOOLEAN, allowNull: true },
  resp_bronquite:        { type: DataTypes.BOOLEAN, allowNull: true },
  resp_tosse:            { type: DataTypes.BOOLEAN, allowNull: true },
  resp_tb:               { type: DataTypes.BOOLEAN, allowNull: true },

  prob_cardiaco:         { type: DataTypes.ENUM('SIM','NÃO','NÃO SABE'), allowNull: true },
  card_dor_peito:        { type: DataTypes.BOOLEAN, allowNull: true },
  card_dor_costas:       { type: DataTypes.BOOLEAN, allowNull: true },
  card_cansa:            { type: DataTypes.BOOLEAN, allowNull: true },
  card_arritmia:         { type: DataTypes.BOOLEAN, allowNull: true },
  card_sopro:            { type: DataTypes.BOOLEAN, allowNull: true },
  card_dorme_altura:     { type: DataTypes.BOOLEAN, allowNull: true },
  card_incha_pe:         { type: DataTypes.BOOLEAN, allowNull: true },

  prob_articulacoes:     { type: DataTypes.BOOLEAN, allowNull: true },
  gravida:               { type: DataTypes.BOOLEAN, allowNull: true },
  anticoncepcional:      { type: DataTypes.BOOLEAN, allowNull: true },
  sangra_facil:          { type: DataTypes.BOOLEAN, allowNull: true },
  hemofilico:            { type: DataTypes.BOOLEAN, allowNull: true },
  sinusite:              { type: DataTypes.BOOLEAN, allowNull: true },
  prob_estomago:         { type: DataTypes.BOOLEAN, allowNull: true },
  xerostomia:            { type: DataTypes.BOOLEAN, allowNull: true },
  dengue:                { type: DataTypes.BOOLEAN, allowNull: true },
  estressado:            { type: DataTypes.BOOLEAN, allowNull: true },
  abriu_boca:            { type: DataTypes.BOOLEAN, allowNull: true },
  autoimune:             { type: DataTypes.BOOLEAN, allowNull: true },

  possui_HIV:            { type: DataTypes.BOOLEAN, allowNull: true },
  leucemia:              { type: DataTypes.BOOLEAN, allowNull: true },
  epilepsia:             { type: DataTypes.BOOLEAN, allowNull: true },
  toma_anticoag:         { type: DataTypes.BOOLEAN, allowNull: true },
  marca_passo:           { type: DataTypes.BOOLEAN, allowNull: true },
  anemia:                { type: DataTypes.ENUM('SIM','NÃO','NÃO SABE'), allowNull: true },

  vicio:                 { type: DataTypes.BOOLEAN, allowNull: true },
  fuma:                  { type: DataTypes.BOOLEAN, allowNull: true },
  bebe:                  { type: DataTypes.BOOLEAN, allowNull: true },
  range_dentes:          { type: DataTypes.BOOLEAN, allowNull: true },
  aperta_dentes:         { type: DataTypes.BOOLEAN, allowNull: true },
  usa_palito:            { type: DataTypes.BOOLEAN, allowNull: true },
  usa_drogas:            { type: DataTypes.BOOLEAN, allowNull: true },
  usa_drogas_obs:        { type: DataTypes.TEXT,    allowNull: true },

  gu_problema:           { type: DataTypes.BOOLEAN, allowNull: true },
  gu_insuficiencia:      { type: DataTypes.BOOLEAN, allowNull: true },
  gu_calculo:            { type: DataTypes.BOOLEAN, allowNull: true },
  gu_infeccao:           { type: DataTypes.BOOLEAN, allowNull: true },
  gu_doenca_venerea:     { type: DataTypes.BOOLEAN, allowNull: true },

  hepa:                  { type: DataTypes.ENUM('SIM','NÃO','NÃO SABE'), allowNull: true },
  hepa_obs:              { type: DataTypes.TEXT,    allowNull: true },

  outra_doenca:          { type: DataTypes.ENUM('SIM','NÃO','NÃO SABE'), allowNull: true },
  diarreia_cronica:      { type: DataTypes.BOOLEAN, allowNull: true },
  febre_const:           { type: DataTypes.BOOLEAN, allowNull: true },
  sudorese:              { type: DataTypes.BOOLEAN, allowNull: true },
  cancer_pele:           { type: DataTypes.BOOLEAN, allowNull: true },
  diabetes_desc:         { type: DataTypes.BOOLEAN, allowNull: true },
  probl_cicatriz:        { type: DataTypes.BOOLEAN, allowNull: true },
  doenca_cont:           { type: DataTypes.BOOLEAN, allowNull: true },
  baixa_imun:            { type: DataTypes.BOOLEAN, allowNull: true },
  dermatite:             { type: DataTypes.BOOLEAN, allowNull: true },

  familia_info:          { type: DataTypes.TEXT,    allowNull: true },
}, {
  tableName: 'usuario_anamneses',
  timestamps: true,
});


export default UsuarioAnamnese;
