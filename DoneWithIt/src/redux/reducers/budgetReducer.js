const initialState = [
    {
      name:"Education",
      plannedAmount:1000,
      actualAmount:200
    },
    {
      name:"Sports",
      plannedAmount:2000,
      actualAmount:600
    },{
      name:"Trip",
      plannedAmount:300,
      actualAmount:60
    },{
      name:"Grocery",
      plannedAmount:14000,
      actualAmount:650
    }
  ]

  const budgetReducer = (state = initialState,action)=>{
    switch(action.type){
        case "Add":
            state = [...state,action.payload]
            return state;
        default:
            return state;
    }
  }

  export default budgetReducer;