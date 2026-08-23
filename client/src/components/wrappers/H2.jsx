export default function H2({ text, children }) {
  return (
    <h2
      className={`w-full text-left font-Futura font-bold text-3xl md:font-bold md:leading-tight md:tracking-tighter ${
        children && "w-full px-1 font-Gilroy font-extralight text-lg text-muted-foreground"
      }
        `}
    >
      {text}
      {children}
    </h2>
  )
}
