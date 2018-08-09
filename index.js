const errorText = `
add 'share/src' to your webpack alias path
do not use
import share from 'share'

use like below
import fxios from "share/util/fxios"
`

throw new Error(errorText)
