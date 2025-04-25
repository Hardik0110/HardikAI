import { motion } from "framer-motion"
import AuthForm from "@/components/ui/auth-form"

export default function LoginPage() {

  return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full h-screen"
      >
        <AuthForm />
      </motion.div>
  )
}
