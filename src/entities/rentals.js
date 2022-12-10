import * as Yup from 'yup';

const rentalsSchema = Yup.object().shape({
  customerId: Yup.number().required('ID do cliente é obrigatório'),
  gameId: Yup.number().required('ID do jogo é obrigatório'),
  daysRented: Yup.number().required('Dia é obrigatório'),
});

export default rentalsSchema;