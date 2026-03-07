'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Mode } from '@core/types'
import { useSettings } from '@core/hooks/useSettings'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Skeleton from '@mui/material/Skeleton'
import Grid from '@mui/material/Grid'

import classnames from 'classnames'
import { motion } from 'framer-motion'
import { Banner } from '@/types/project-types'
import { parseApiData } from '@/utils/apiUtils'

const HeroSection = () => {
  return (
    <section className='relative bs-[calc(100vh+80px)] flex items-center justify-center' style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', marginTop: '-80px' }}>
      <div className='absolute inset-0 bg-black/40 z-0' />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className='relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mt-16'
      >
        <Typography variant='h1' className='text-white font-extrabold mbe-6 drop-shadow-lg' sx={{ fontSize: { xs: '3rem', md: '5rem' } }}>
          Discover The World
        </Typography>
        <Typography variant='h5' className='text-white/90 mbe-10 drop-shadow-md max-w-2xl'>
          Unforgettable adventures await. Explore beautiful destinations, find exclusive deals, and book your dream trip today.
        </Typography>
        
        <div className='flex items-center bg-white p-2 rounded-full w-full max-w-2xl shadow-2xl'>
          <TextField
            variant="standard"
            placeholder="Where do you want to go?"
            fullWidth
            className='px-6'
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <i className="ri-map-pin-line text-xl" />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant='contained' 
            size='large' 
            className='rounded-full px-8 py-3 whitespace-nowrap min-w-[150px] shadow-primary'
            onClick={() => window.location.href = '/dashboard'}
          >
            Search
          </Button>
        </div>
      </motion.div>
    </section>
  )
}

const PopularDestinations = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkIsLoggedIn = () => {
    return document.cookie.split(';').some((item) => item.trim().startsWith('user_info='))
  }

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/banners`, {
          headers: { apiKey: process.env.NEXT_PUBLIC_API_KEY || '' }
        })
        const json = await response.json()
        const data = parseApiData<Banner[]>(json)
        setBanners(data)
      } catch (error) {
        console.error('Error fetching banners:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  const handleExplore = () => {
    if (checkIsLoggedIn()) {
      router.push('/dashboard')
    } else {
      router.push('/login?redirectTo=/dashboard')
    }
  }

  return (
    <section className='plb-[100px] bg-backgroundDefault px-6 md:px-12 lg:px-24'>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className='text-center mbe-16'
      >
        <Typography variant='h3' className='font-bold mbe-4'>Popular Destinations</Typography>
        <Typography color='text.secondary'>Explore our most sought-after locations curated just for you from our live banners.</Typography>
      </motion.div>
      
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className='bs-[450px]'>
              <Skeleton variant="rectangular" className='rounded-2xl bs-full' />
            </div>
          ))
        ) : (
          banners.slice(0, 6).map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className='overflow-hidden group hover:-translate-y-2 transition-transform duration-300 shadow-xl cursor-pointer rounded-2xl h-full' onClick={handleExplore}>
                <div className='relative overflow-hidden bs-[300px]'>
                  <CardMedia
                    component='img'
                    image={banner.imageUrl}
                    alt={banner.name}
                    className='bs-full object-cover group-hover:scale-110 transition-transform duration-700'
                  />
                  <div className='absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent'>
                    <Typography variant='h5' className='text-white font-bold'>{banner.name}</Typography>
                  </div>
                  <div className='absolute top-4 right-4 bg-primary text-white font-bold px-4 py-1.5 rounded-full text-sm shadow-lg backdrop-blur-sm'>
                    Live Offer
                  </div>
                </div>
                <CardContent className='p-6'>
                  <Typography color='text.secondary' className='mbe-6 text-[15px]'>
                    Experience the beauty of {banner.name} with our exclusive travel packages.
                  </Typography>
                  <div className='flex justify-between items-center'>
                    <div className='flex text-warning text-lg'>
                      <i className='ri-star-fill' />
                      <i className='ri-star-fill' />
                      <i className='ri-star-fill' />
                      <i className='ri-star-fill' />
                      <i className='ri-star-fill text-white/20' />
                    </div>
                    <Button variant='outlined' size='small' className='rounded-full px-5' onClick={handleExplore}>Explore</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </section>
  )
}

const WhyChooseUs = () => {
  const features = [
    { icon: 'ri-global-line', title: 'World Class Travel', desc: 'We provide you with the best travel experiences across the globe tailored to you.' },
    { icon: 'ri-money-dollar-circle-line', title: 'Best Price Guarantee', desc: 'Find a lower price? We will aggressively match it, guaranteed.' },
    { icon: 'ri-customer-service-2-line', title: '24/7 Support', desc: 'Our dedicated team is always here around the clock to assist your travels.' },
    { icon: 'ri-shield-check-line', title: 'Secure Booking', desc: 'Your payments and personal data are 100% heavily secured with us.' },
  ]

  return (
    <section className='plb-[100px] bg-primary/5 px-6 md:px-12 lg:px-24 overflow-hidden relative'>
      <div className='flex flex-col md:flex-row items-center gap-16 relative z-10'>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='flex-1 relative order-2 md:order-1'
        >
          <img src='https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80' alt='Travel' className='rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 max-w-full' />
          <div className='absolute -bottom-8 -left-8 bg-backgroundPaper p-6 rounded-2xl shadow-xl hidden md:block animate-bounce-slow'>
            <div className='text-center'>
              <Typography variant='h3' color='primary' className='font-bold leading-none'>15K+</Typography>
              <Typography variant='subtitle2' color='text.secondary' className='font-medium mt-1'>Happy Travelers</Typography>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='flex-1 order-1 md:order-2'
        >
          <Typography variant='h3' className='font-bold mbe-6'>Why Choose Us?</Typography>
          <Typography color='text.secondary' className='mbe-10 text-lg leading-relaxed'>
            With over a decade of experience in organizing top-notch travel packages, we pride ourselves on delivering picture-perfect memories that last a lifetime.
          </Typography>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
            {features.map((opt, i) => (
              <div key={i} className='flex gap-4 group'>
                <div className='flex items-center justify-center bs-12 is-12 rounded-xl bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm'>
                  <i className={classnames(opt.icon, 'text-2xl')} />
                </div>
                <div>
                  <Typography variant='h6' className='mbe-1 font-bold'>{opt.title}</Typography>
                  <Typography variant='body2' color='text.secondary' className='leading-normal'>{opt.desc}</Typography>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const CTASection = () => {
  return (
    <section className='plb-[100px] bg-primary text-white text-center px-6 relative overflow-hidden'>
      <div className='absolute inset-0 bg-black/10 z-0' />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className='max-w-3xl mx-auto relative z-10'
      >
        <Typography variant='h3' className='text-white font-bold mbe-6 drop-shadow-md'>Ready for your next adventure?</Typography>
        <Typography className='text-white/90 mbe-10 text-lg md:text-xl drop-shadow'>
          Join our community of explorers and get exclusive access to limited-time offers and incredible bucket-list destinations.
        </Typography>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Button variant='contained' color='secondary' size='large' className='rounded-full px-10 py-3 shadow-lg hover:shadow-xl transition-shadow font-bold'>
            Join our Newsletter
          </Button>
          <Button 
            variant='outlined' 
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.7)', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}} 
            size='large' 
            className='rounded-full px-10 py-3 font-bold backdrop-blur-sm'
            onClick={() => window.location.href = '/dashboard'}
          >
            View Packages
          </Button>
        </div>
      </motion.div>
    </section>
  )
}

const LandingPageWrapper = ({ mode }: { mode: Mode }) => {
  // Hooks
  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='bg-backgroundPaper'>
      <HeroSection />
      <PopularDestinations />
      <WhyChooseUs />
      <CTASection />
    </div>
  )
}

export default LandingPageWrapper
