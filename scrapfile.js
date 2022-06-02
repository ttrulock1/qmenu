    let remainingTransAmount = 0 - newTransAmount;
             for(let i = 0; i < clonedCharges1.length && remainingTransAmount > 0; i++) {
                clonedCharges1.amount-newTransAmount;
                  if (currentCharge.amount = 0){             				
                        const newamount= newTransAmount- orderObject.charges[i].amount;
                        const charge = clonedCharges1[i];
                        const amountAppliedToCharge = Math.min(charge.amount, remainingTransAmount)
                        const identification= charge.id;
                        // this code works
                          orderObject.refunds.push({
                            charge_id: identification,
                            amount: number
                        })}
                        return orderObject
                    }


                    let remainingTransAmount = 0 - newTransAmount;
                    for(let i = 0; i < clonedCharges1.length && remainingTransAmount > 0; i++) {      
                     const charge = clonedCharges1[i];
                     const amountAppliedToCharge = Math.min(charge.amount, remainingTransAmount)
                            //    this code works
                        if (amountAppliedToCharge.amount > 0){ 
                             remainingTransAmount -= amountAppliedToCharge;
                             orderObject.refunds.push({
                                charge_id: charge.id,
                                amount: 0 - amountAppliedToCharge
                               })
                            } 
                        }   
                        return orderObject
        }
        