export const priceComma = (money: number | undefined | null) => {
  if(money) {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}