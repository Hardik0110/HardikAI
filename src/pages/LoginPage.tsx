import { motion } from "framer-motion"
import AuthForm from "@/components/ui/auth-form"

export default function LoginPage() {

  return (
    <div className="flex items-center justify-center ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative  w-full "
      >
        <AuthForm />
      </motion.div>
    </div>
  )
}
