import { ArrowRight } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Image from 'next/image'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface TeamMemberCardProps {
  position?: 'left' | 'right'
  jobPosition?: string
  firstName?: string
  lastName?: string
  imageUrl?: string
  description?: string
  extraText?: string
  className?: string
  href?: string
}

export default function TeamMemberCard({
  position = 'left',
  jobPosition = 'Backend Engineer',
  firstName = 'Jennie',
  lastName = 'Garcia',
  imageUrl = 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?fm=jpg&q=60',
  description = 'Jennie is a skilled developer with expertise in modern web technologies and a passion for creating seamless user experiences.',
  extraText = 'Driven by a pursuit of excellence, pushing the boundaries of what is possible in the digital space.',
  className,
  href = '#',
}: TeamMemberCardProps) {
  const fullName = `${firstName} ${lastName}`
  const isPositionRight = position === 'right'

  return (
    <div className={cn(
      'relative w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-24 my-16 lg:my-48',
      isPositionRight && 'lg:flex-row-reverse',
      className
    )}>
      
      {/* Extra Text (Opposite Side) — Becomes a footer/caption on mobile */}
      <div className={cn(
        "lg:w-1/3 flex flex-col items-start gap-6 w-full fade-up order-2 lg:order-none", 
        isPositionRight && "lg:items-end lg:text-right"
      )}>
        <p className="font-sans font-light text-base md:text-lg lg:text-xl text-black/60 leading-relaxed max-w-sm">
          {extraText}
        </p>
      </div>

      {/* Main Card Element */}
      <div className="lg:w-2/3 flex flex-col w-full relative order-1 lg:order-none">
        {/* Mobile Header: Job Position */}
        <div className={cn("flex flex-col mb-6 md:mb-8 fade-up", isPositionRight && "lg:items-end")}>
          <p className="text-[10px] font-semibold tracking-[0.3em] text-[var(--color-sage)] uppercase">
            {jobPosition}
          </p>
        </div>

        {/* Flexible layout: Stacked on mobile, overlapped on desktop */}
        <div className={cn(
          'flex flex-col lg:flex-row items-center lg:items-center gap-10 lg:gap-0', 
          isPositionRight ? 'lg:justify-start lg:flex-row-reverse' : 'lg:justify-end lg:flex-row'
        )}>
          {/* Portrait image */}
          <div className={cn(
            'relative h-[400px] md:h-[550px] w-full md:w-[450px] lg:w-[350px] shrink-0 overflow-hidden rounded-2xl bg-[var(--color-pale-warm)] shadow-2xl fade-up',
            isPositionRight && 'lg:order-2'
          )}>
            <div className='pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/30 via-transparent to-transparent' />
            <div className="absolute inset-[-15%] w-[130%] h-[130%] parallax-bg">
              <Image
                src={imageUrl}
                alt={fullName}
                fill
                className='object-cover duration-700 hover:scale-105'
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          </div>

          {/* Info block — overlaps on desktop, stacks below on mobile */}
          <div className={cn(
            'relative z-20 flex flex-col gap-8 lg:gap-14 fade-up w-full lg:w-[calc(100%-250px)]',
            isPositionRight 
              ? 'lg:right-12 lg:items-end' 
              : 'lg:-left-12 lg:items-start'
          )}>
            {/* Display name */}
            <div>
              <p className={cn(
                'font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-[var(--color-obsidian)]',
                isPositionRight && 'lg:text-right'
              )}>
                {firstName}
                <br />
                {lastName && <span className='italic font-light'>{lastName}</span>}
              </p>
            </div>

            {/* Details row — toggle + bio */}
            <div className={cn(
              'flex flex-col sm:flex-row gap-6 md:gap-8 items-start sm:items-center', 
              isPositionRight && 'lg:flex-row-reverse'
            )}>
              {/* Circular CTA */}
              <a href={href} className={cn(
                'group flex h-16 w-16 md:h-20 md:w-20 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/20 transition-all duration-500 hover:border-black/60 hover:bg-[var(--color-obsidian)]',
                isPositionRight && 'lg:order-2'
              )}>
                <ArrowRight
                  size={22}
                  className={cn(
                    'text-[var(--color-obsidian)] transition-all duration-500 group-hover:-rotate-45 group-hover:text-white',
                    isPositionRight && 'rotate-180 lg:group-hover:rotate-225'
                  )}
                />
              </a>

              {/* Bio copy */}
              <div className='w-full lg:w-[70%]'>
                <p className={cn(
                  'font-sans font-light text-sm md:text-base leading-[1.6] text-black/60',
                  isPositionRight && 'lg:text-right'
                )}>
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
