import { Card, CardContent } from "./ui/card"

export const Footer = () => {
    return(
        <Card className="">
        <CardContent className="px-5 py-6">
          <p className="text-sm text-gray-400">
            2024 - Made by
            <span className="font-bold"> Gabriel Alberto</span>
          </p>
        </CardContent>
      </Card>
    )
}

export default Footer