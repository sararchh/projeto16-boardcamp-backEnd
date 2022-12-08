import * as Yup from 'yup';

const gameSchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  image: Yup.string().required('Imagem obrigatório'),
  stockTotal: Yup.number().min(1).required('stockTotal é obrigatório'),
  categoryId: Yup.number().min(1).required('categoryId é obrigatório'),
  pricePerDay: Yup.number().min(1).required('pricePerDay é obrigatório'),
});

export default gameSchema;
